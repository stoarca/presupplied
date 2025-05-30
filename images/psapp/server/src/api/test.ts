import express from 'express';
import { Like } from 'typeorm';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserRelationship } from '../entity/UserRelationship';
import { typedPost, typedGet } from '../typedRoutes';
import { RelationshipType, UserType, UserProgressDTO } from '../../../common/types';

// Store logs and errors for testing purposes
const testLogs: string[] = [];
const testErrors: string[] = [];

// Flag to indicate if we're in test mode
export let isTestModeEnabled = false;

async function deleteAccount(user: User): Promise<number> {
  const userRepository = AppDataSource.getRepository(User);
  const relationshipRepository = AppDataSource.getRepository(UserRelationship);
  
  let deletedCount = 1;
  
  if (user.type === UserType.PARENT || user.type === UserType.TEACHER) {
    const childRelationships = await relationshipRepository.find({
      where: { adultId: user.id },
      relations: ['child']
    });
    
    for (const relationship of childRelationships) {
      const otherParentRelationships = await relationshipRepository.find({
        where: { 
          childId: relationship.childId,
          type: RelationshipType.PRIMARY
        }
      });
      
      if (otherParentRelationships.length === 1 && otherParentRelationships[0].adultId === user.id) {
        await userRepository.remove(relationship.child);
        deletedCount++;
      }
    }
  }
  
  await userRepository.remove(user);
  
  return deletedCount;
}

export const setupTestRoutes = (router: express.Router) => {
  // Endpoint to log messages from the client
  typedPost(router, '/api/test/weblog', async (req, resp) => {
    const { message, type } = req.body;
    
    if (type === 'error') {
      testErrors.push(message);
    } else {
      testLogs.push(message);
    }
    
    return resp.json({ success: true });
  });
  
  // Endpoint to retrieve logs for debugging tests
  typedGet(router, '/api/test/weblogdump', async (req, resp) => {
    const logs = [...testLogs];
    testLogs.length = 0; // Clear logs after dumping
    
    return resp.json({
      success: true,
      logs,
    });
  });
  
  typedGet(router, '/api/test/weberrordump', async (req, resp) => {
    const errors = [...testErrors];
    testErrors.length = 0;
    
    return resp.json({
      success: true,
      errors,
    });
  });
  
  typedPost(router, '/api/test/enable', async (req, resp) => {
    isTestModeEnabled = true;
    testLogs.length = 0;
    testErrors.length = 0;
    
    const userRepository = AppDataSource.getRepository(User);
    const testAccounts = await userRepository.find({
      where: { email: Like('ps-test-account-%') },
    });
    
    let deletedCount = 0;
    for (const testAccount of testAccounts) {
      deletedCount += await deleteAccount(testAccount);
    }
    
    return resp.json({
      success: true,
      message: 'Test mode enabled',
      deletedCount
    });
  });
  
  typedPost(router, '/api/test/disable', async (req, resp) => {
    isTestModeEnabled = false;
    
    return resp.json({
      success: true,
      message: 'Test mode disabled'
    });
  });
  typedPost(router, '/api/test/get-user-info', async (req, resp, next) => {
    const { email } = req.body;
    
    if (!email.startsWith('ps-test-account-')) {
      return resp.status(403).json({
        errorCode: 'test.notTestAccount',
        message: 'This endpoint only works with test accounts (prefix: ps-test-account-)',
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
      relations: ['progress', 'progress.module', 'childRelationships', 'childRelationships.child', 'childRelationships.child.progress', 'childRelationships.child.progress.module', 'childRelationships.child.progress.completedBy'],
    });

    if (!user) {
      return resp.status(404).json({
        errorCode: 'test.userNotFound',
        message: 'User not found',
      });
    }

    const dto = {
      id: user.id,
      name: user.name,
      email: user.email || '',
      type: user.type,
      profilePicture: user.profilePicture,
      pinRequired: user.pinRequired,
      progress: user.progress.reduce((acc, x) => {
        acc[x.module.vanityId] = {
          status: x.status,
          events: [],
        };
        return acc;
      }, {} as UserProgressDTO),
      pendingInvites: [],
      children: user.childRelationships.map(rel => ({
        id: rel.child.id,
        name: rel.child.name,
        profilePicture: rel.child.profilePicture!,
        pinRequired: rel.child.pinRequired,
        relationshipType: rel.type,
        progress: rel.child.progress.reduce((acc, x) => {
          acc[x.module.vanityId] = {
            status: x.status,
            completedById: x.completedBy?.id,
            events: [],
          };
          return acc;
        }, {} as UserProgressDTO)
      })),
    };
    return resp.json({
      success: true,
      user: dto,
    });
  });
};
