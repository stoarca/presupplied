import express from 'express';
import { In } from 'typeorm';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserProgress } from '../entity/UserProgress';
import { UserVideoProgress } from '../entity/UserVideoProgress';
import { Module } from '../entity/Module';
import { UserRelationship } from '../entity/UserRelationship';
import {
  GraphNode,
  KNOWLEDGE_MAP,
  ProgressStatus,
  ProgressVideoStatus,
  ModuleType,
  VideoProgressDTO
} from '../../../common/types';
import { isModuleForAdults } from '../../../common/utils';
import { typedGet, typedPost } from '../typedRoutes';

// Create an efficient lookup map for modules
const moduleMap = new Map<string, GraphNode>();
KNOWLEDGE_MAP.nodes.forEach(node => {
  moduleMap.set(node.id, node);
});

export const setupLearningRoutes = (router: express.Router) => {

  typedPost(router, '/api/learning/module_progress', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noLogin',
        message: 'You need to be logged in to save progress',
      });
    }

    const moduleIds = Object.keys(req.body.modules);

    const userRepo = AppDataSource.getRepository(User);
    const baseUser = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!baseUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noUser',
        message: 'Could not find the authenticated user',
      });
    }

    // Verify that onBehalfOfStudentId is set for modules that require it
    // Skip this check for student accounts as they can submit child modules for themselves
    if (baseUser.type !== 'student') {
      for (const moduleId of moduleIds) {
        const moduleData = moduleMap.get(moduleId);
        if (moduleData?.moduleType === ModuleType.CHILD_DELEGATED && !req.body.onBehalfOfStudentId) {
          return resp.status(400).json({
            errorCode: 'learning.event.missingStudentId',
            message: `Module ${moduleId} requires onBehalfOfStudentId parameter`,
            moduleId: moduleId
          });
        }
      }
    }

    const moduleRepo = AppDataSource.getRepository(Module);
    const modules = await moduleRepo.findBy({
      vanityId: In(moduleIds),
    });
    if (moduleIds.length !== modules.length) {
      const requestedModuleIdSet = new Set(moduleIds);
      const retrievedModuleIdSet = new Set(modules.map(x => x.vanityId));
      for (const id of retrievedModuleIdSet) {
        requestedModuleIdSet.delete(id);
      }
      return resp.status(422).json({
        errorCode: 'learning.event.invalidModules',
        moduleVanityIds: Array.from(requestedModuleIdSet),
        message: 'Could not find the requested learning modules',
      });
    }

    let targetUser = baseUser;

    // Error if both selectedUserId and onBehalfOfStudentId are provided
    if (req.jwtUser.selectedUserId &&
        req.jwtUser.selectedUserId !== baseUser.id &&
        req.body.onBehalfOfStudentId) {
      return resp.status(403).json({
        errorCode: 'learning.event.unauthorized',
        message: 'A student account cannot modify progress for another student',
      });
    }

    if (req.jwtUser.selectedUserId && req.jwtUser.selectedUserId !== baseUser.id) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: baseUser.id,
          childId: req.jwtUser.selectedUserId
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.event.unauthorized',
          message: 'No relationship exists with the selected user',
        });
      }

      targetUser = relationship.child;
    }

    if (req.body.onBehalfOfStudentId) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: baseUser.id,
          childId: req.body.onBehalfOfStudentId
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.event.unauthorized',
          message: 'No relationship exists with the specified student',
        });
      }

      targetUser = relationship.child;
    }

    const userProgressRepo = AppDataSource.getRepository(UserProgress);
    await userProgressRepo.upsert(modules.map(x => {
      const events = req.body.modules[x.vanityId].events;
      const mostRecentEvent = events.sort((a, b) => b.time - a.time)[0];
      const progressData: {
        user: User;
        module: Module;
        status: ProgressStatus;
        completedBy?: User;
      } = {
        user: targetUser,
        module: x,
        status: mostRecentEvent.status,
      };
      
      if (req.body.onBehalfOfStudentId && targetUser.id !== baseUser.id) {
        progressData.completedBy = baseUser;
      }
      
      return progressData;
    }), ['user', 'module'])

    return resp.json({success: true});
  });

  typedPost(router, '/api/learning/video_progress', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.video_progress.noLogin',
        message: 'You need to be logged in to save video progress',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const baseUser = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!baseUser) {
      return resp.status(401).json({
        errorCode: 'learning.video_progress.noUser',
        message: 'Could not find the authenticated user',
      });
    }

    let targetUser = baseUser;

    if (req.jwtUser.selectedUserId && req.jwtUser.selectedUserId !== baseUser.id) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: baseUser.id,
          childId: req.jwtUser.selectedUserId
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.video_progress.unauthorized',
          message: 'No relationship exists with the selected user',
        });
      }

      targetUser = relationship.child;
    }

    if (req.body.onBehalfOfStudentId) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: baseUser.id,
          childId: req.body.onBehalfOfStudentId
        },
        relations: ['child']
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'learning.video_progress.unauthorized',
          message: 'No relationship exists with the specified student',
        });
      }

      targetUser = relationship.child;
    }

    const userVideoProgressRepo = AppDataSource.getRepository(UserVideoProgress);
    const inserts = [];
    for (const videoId in req.body.videos) {
      const videoData = req.body.videos[videoId];
      inserts.push({
        user: targetUser,
        videoId: videoId,
        status: videoData.status,
        updatedAt: new Date(videoData.updatedAt),
      });
    }
    await userVideoProgressRepo.upsert(
      inserts,
      ['user', 'videoId']
    );

    return resp.json({success: true});
  });
};
