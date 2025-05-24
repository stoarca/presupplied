import express from 'express';
import { In } from 'typeorm';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserProgress } from '../entity/UserProgress';
import { UserProgressVideo } from '../entity/UserProgressVideo';
import { Module } from '../entity/Module';
import { UserRelationship } from '../entity/UserRelationship';
import {
  GraphNode,
  KNOWLEDGE_MAP,
  ProgressStatus,
  ProgressVideoStatus
} from '../../../common/types';
import { typedGet, typedPost } from '../typedRoutes';

// Create an efficient lookup map for modules
const moduleMap = new Map<string, GraphNode>();
KNOWLEDGE_MAP.nodes.forEach(node => {
  moduleMap.set(node.id, node);
});

export const setupLearningRoutes = (router: express.Router) => {
  typedGet(router, '/api/learning/progressvideos/:kmid', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.progressvideos.noLogin',
        message: 'You need to be logged in get video progress',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!user) {
      return resp.status(401).json({
        errorCode: 'learning.progressvideos.noStudent',
        email: req.jwtUser.email,
        message: 'Could not find a user with this email',
      });
    }

    const moduleRepo = AppDataSource.getRepository(Module);
    const module = await moduleRepo.findOneBy({
      vanityId: req.params.kmid,
    });
    if (!module) {
      return resp.status(400).json({
        errorCode: 'learning.progressvideos.noModule',
        moduleVanityId: req.params.kmid,
        message: 'Could not find a student with this email',
      });
    }

    const userProgressRepo = AppDataSource.getRepository(UserProgress);
    const userProgress = await userProgressRepo.findOneBy({
      user: { id: user.id },
      module: { id: module.id },
    });

    if (!userProgress) {
      return resp.json({
        success: true,
        videos: {},
      });
    }

    const userProgressVideoRepo = AppDataSource.getRepository(UserProgressVideo);
    const userProgressVideos = await userProgressVideoRepo.findBy({
      userProgress: { id: userProgress.id },
    });

    const videos: Record<string, ProgressVideoStatus> = {};
    userProgressVideos.forEach(x => {
      videos[x.videoVanityId] = x.status;
    });
    return resp.json({
      success: true,
      videos: videos,
    });
  });

  typedPost(router, '/api/learning/events', async (req, resp, next) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noLogin',
        message: 'You need to be logged in to save progress',
      });
    }

    const moduleIds = Object.keys(
      req.body.type === 'module' ? req.body.modules : req.body.moduleVideos
    );

    // Verify that onBehalfOfStudentId is set for modules that require it
    if (req.body.type === 'module') {
      for (const moduleId of moduleIds) {
        const moduleData = moduleMap.get(moduleId);
        if (moduleData?.forTeachers && moduleData?.onBehalfOfStudent && !req.body.onBehalfOfStudentId) {
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

    const userRepo = AppDataSource.getRepository(User);
    const baseUser = await userRepo.findOneBy({ email: req.jwtUser.email });
    if (!baseUser) {
      return resp.status(401).json({
        errorCode: 'learning.event.noUser',
        message: 'Could not find the authenticated user',
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
    if (req.body.type === 'module') {
      const body = req.body;
      await userProgressRepo.upsert(modules.map(x => {
        const events = body.modules[x.vanityId].events;
        const mostRecentEvent = events.sort((a, b) => b.time - a.time)[0];
        return {
          user: targetUser,
          module: x,
          status: mostRecentEvent.status,
        };
      }), ['user', 'module'])
    } else {
      try {
        await userProgressRepo.insert(modules.map(x => {
          return {
            user: targetUser,
            module: x,
            status: ProgressStatus.NOT_ATTEMPTED,
          };
        }));
      } catch (e) {
        if ((e as Error).message.includes('duplicate key value')) {
          // row will alrady exist when we're watching a video on a module
          // we've attempted before. Ignore this.
        } else {
          throw e;
        }
      }

      const userProgresses = await userProgressRepo.find({
        where: {
          user: { id: targetUser.id },
          module: { id: In(modules.map(x => x.id)) },
        },
        relations: {
          module: true,
        },
      });
      const userProgressMap: Record<string, UserProgress> = {};
      userProgresses.forEach((x) => {
        userProgressMap[x.module.vanityId] = x;
      });
      const userProgressVideoRepo = AppDataSource.getRepository(UserProgressVideo);
      const inserts = [];
      for (const kmid in req.body.moduleVideos) {
        for (const videoVanityId in req.body.moduleVideos[kmid]) {
          inserts.push({
            userProgress: userProgressMap[kmid],
            videoVanityId: videoVanityId,
            status: req.body.moduleVideos[kmid][videoVanityId],
          });
        }
      }
      await userProgressVideoRepo.upsert(
        inserts,
        ['userProgress', 'videoVanityId']
      );
    }

    return resp.json({success: true});
  });
};