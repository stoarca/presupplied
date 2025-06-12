import express from 'express';
import { In, Not } from 'typeorm';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserRelationship } from '../entity/UserRelationship';
import { UserInvitation, InvitationStatus } from '../entity/UserInvitation';
import { UserVideoProgress } from '../entity/UserVideoProgress';
import {
  UserProgressDTO,
  UserDTO,
  UserType,
  RelationshipType,
  InvitationDTO,
  VideoProgressDTO
} from '../../../common/types';
import { typedGet, typedPost } from '../typedRoutes';

export const setupUserRoutes = (router: express.Router) => {
  

  typedGet(router, '/api/user', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.json({ user: null });
    }

    const userRepo = AppDataSource.getRepository(User);
    const childId = req.jwtUser.selectedUserId;
    let selectedUser;

    if (childId) {
      const adultUser = await userRepo.findOne({
        where: { email: req.jwtUser.email }
      });

      if (!adultUser) {
        return resp.json({ user: null });
      }

      if (childId === adultUser.id) {
        selectedUser = await userRepo.findOne({
          where: { id: adultUser.id },
          relations: { progress: { module: true }, videoProgress: true }
        });
      } else {
        const relationshipRepo = AppDataSource.getRepository(UserRelationship);
        const relationship = await relationshipRepo.findOne({
          where: {
            adultId: adultUser.id,
            childId: childId
          }
        });

        if (!relationship) {
          return resp.json({ user: null });
        }

        selectedUser = await userRepo.findOne({
          where: { id: childId },
          relations: { progress: { module: true }, videoProgress: true }
        });
      }
    } else {
      selectedUser = await userRepo.findOne({
        where: { email: req.jwtUser.email },
        relations: { progress: { module: true }, videoProgress: true }
      });
    }

    if (!selectedUser) {
      return resp.json({ user: null });
    }

    let userDTO: UserDTO = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email || '',
      type: selectedUser.type,
      profilePicture: selectedUser.profilePicture,
      pinRequired: selectedUser.pinRequired,
      progress: selectedUser.progress.reduce((acc, x) => {
        acc[x.module.vanityId] = {
          status: x.status,
          events: [],
        };
        return acc;
      }, {} as UserProgressDTO),
      videoProgress: selectedUser.videoProgress.reduce((acc, x) => {
        acc[x.videoId] = {
          status: x.status,
          updatedAt: x.updatedAt.toISOString()
        };
        return acc;
      }, {} as VideoProgressDTO),
      pendingInvites: [],
      birthday: selectedUser.birthday ? selectedUser.birthday.toString() : null,
      gender: selectedUser.gender || null
    };

    if (selectedUser.type === UserType.PARENT || selectedUser.type === UserType.TEACHER) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const childRelationships = await relationshipRepo.find({
        where: {
          adultId: selectedUser.id
        },
        relations: ['child', 'child.progress', 'child.progress.module', 'child.progress.completedBy']
      });

      if (childRelationships.length > 0) {
        userDTO.children = childRelationships.map(rel => ({
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
          }, {} as UserProgressDTO),
          birthday: rel.child.birthday ? rel.child.birthday.toString() : null,
          gender: rel.child.gender || null
        }));
      }

      const invitationRepo = AppDataSource.getRepository(UserInvitation);
      const pendingInvites = await invitationRepo.find({
        where: {
          inviteeEmail: selectedUser.email,
          status: InvitationStatus.PENDING
        },
        relations: ['inviterUser', 'childUser']
      });

      userDTO.pendingInvites = pendingInvites.map(invite => ({
        id: invite.id,
        inviterUser: {
          id: invite.inviterUser.id,
          name: invite.inviterUser.name,
          email: invite.inviterUser.email!,
          type: invite.inviterUser.type
        },
        childUser: {
          id: invite.childUser.id,
          name: invite.childUser.name,
          profilePicture: invite.childUser.profilePicture
        },
        inviteeEmail: invite.inviteeEmail,
        relationshipType: invite.relationshipType,
        status: invite.status,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt,
        token: invite.token
      }));
    }

    if (selectedUser.type === UserType.STUDENT) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const adultRelationships = await relationshipRepo.find({
        where: {
          childId: selectedUser.id
        },
        relations: ['adult']
      });

      if (adultRelationships.length > 0) {
        userDTO.adults = adultRelationships.map(rel => {
          const isLoggedInAdult = childId &&
            req.jwtUser &&
            req.jwtUser.email === rel.adult.email;

          return {
            id: rel.adult.id,
            name: rel.adult.name,
            email: rel.adult.email!,
            type: rel.adult.type,
            profilePicture: rel.adult.profilePicture,
            relationshipType: rel.type,
            loggedIn: !!isLoggedInAdult
          };
        });

        if (childId && req.jwtUser) {
          const loggedInAdult = adultRelationships.find(rel => 
            rel.adult.email === req.jwtUser!.email
          );
          
          if (loggedInAdult) {
            const classmateRelationships = await relationshipRepo.find({
              where: {
                adultId: loggedInAdult.adult.id,
                childId: Not(selectedUser.id)
              },
              relations: ['child']
            });

            if (classmateRelationships.length > 0) {
              userDTO.classmates = classmateRelationships.map(rel => ({
                id: rel.child.id,
                name: rel.child.name,
                profilePicture: rel.child.profilePicture!,
                pinRequired: rel.child.pinRequired,
                relationshipType: rel.type,
                birthday: rel.child.birthday ? rel.child.birthday.toString() : null,
                gender: rel.child.gender || null
              }));
            }
          }
        }
      }
    }

    return resp.json({ user: userDTO });
  });



  typedPost(router, '/api/users/:id', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'users.update.notLoggedIn',
        message: 'You need to be logged in to update profile',
      });
    }

    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return resp.status(400).json({
        errorCode: 'users.update.invalidId',
        message: 'Invalid user ID format',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const currentUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!currentUser) {
      return resp.status(401).json({
        errorCode: 'users.update.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }

    const targetUser = await userRepo.findOne({
      where: { id: userId }
    });

    if (!targetUser) {
      return resp.status(404).json({
        errorCode: 'users.update.userNotFound',
        message: 'Target user not found',
      });
    }

    if (currentUser.id === userId) {
      if (req.body.name && req.body.name.trim()) {
        targetUser.name = req.body.name.trim();
      }
      if (req.body.profilePicture) {
        targetUser.profilePicture = req.body.profilePicture;
      }
      if (req.body.birthday !== undefined) {
        targetUser.birthday = req.body.birthday ? new Date(req.body.birthday) : null;
      }
      if (req.body.gender !== undefined) {
        targetUser.gender = req.body.gender || null;
      }
      await userRepo.save(targetUser);
      return resp.json({
        success: true
      });
    }

    if (targetUser.type === UserType.STUDENT) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: currentUser.id,
          childId: userId
        }
      });

      if (!relationship || relationship.type !== RelationshipType.PRIMARY) {
        return resp.status(403).json({
          errorCode: 'users.update.unauthorized',
          message: 'Only primary relationships can update child profiles',
        });
      }

      if (req.body.name && req.body.name.trim()) {
        targetUser.name = req.body.name.trim();
      }
      if (req.body.profilePicture) {
        targetUser.profilePicture = req.body.profilePicture;
      }
      if (req.body.birthday !== undefined) {
        targetUser.birthday = req.body.birthday ? new Date(req.body.birthday) : null;
      }
      if (req.body.gender !== undefined) {
        targetUser.gender = req.body.gender || null;
      }
      await userRepo.save(targetUser);
      return resp.json({
        success: true
      });
    }

    return resp.status(403).json({
      errorCode: 'users.update.unauthorized',
      message: 'You cannot update this user profile',
    });
  });

  typedGet(router, '/api/users/:id', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'users.get.notLoggedIn',
        message: 'You need to be logged in to view user details',
      });
    }

    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return resp.status(400).json({
        errorCode: 'users.get.invalidId',
        message: 'Invalid user ID format',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const currentUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!currentUser) {
      return resp.status(401).json({
        errorCode: 'users.get.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }

    const targetUser = await userRepo.findOne({
      where: { id: userId },
      relations: ['adultRelationships', 'adultRelationships.adult']
    });

    if (!targetUser) {
      return resp.status(404).json({
        errorCode: 'users.get.userNotFound',
        message: 'Target user not found',
      });
    }

    if (currentUser.id === userId) {
      const userDTO: UserDTO = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email || '',
        type: targetUser.type,
        profilePicture: targetUser.profilePicture,
        pinRequired: targetUser.pinRequired,
        progress: {},
        videoProgress: {},
        pendingInvites: [],
        birthday: targetUser.birthday ? targetUser.birthday.toString() : null,
        gender: targetUser.gender || null
      };
      
      return resp.json({
        user: userDTO
      });
    }

    if (targetUser.type === UserType.STUDENT) {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const relationship = await relationshipRepo.findOne({
        where: {
          adultId: currentUser.id,
          childId: userId
        }
      });

      if (!relationship) {
        return resp.status(403).json({
          errorCode: 'users.get.noPermission',
          message: 'No relationship exists with this user',
        });
      }


      const invitationRepo = AppDataSource.getRepository(UserInvitation);
      const pendingInvites = await invitationRepo.find({
        where: {
          childId: userId,
          status: InvitationStatus.PENDING
        },
        relations: ['inviterUser', 'childUser']
      });

      const invites = pendingInvites.map(invite => ({
        id: invite.id,
        inviterUser: {
          id: invite.inviterUser.id,
          name: invite.inviterUser.name,
          email: invite.inviterUser.email!,
          type: invite.inviterUser.type
        },
        childUser: {
          id: invite.childUser.id,
          name: invite.childUser.name,
          profilePicture: invite.childUser.profilePicture
        },
        inviteeEmail: invite.inviteeEmail,
        relationshipType: invite.relationshipType,
        status: invite.status,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt,
        token: invite.token
      }));

      const userDTO: UserDTO = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email || '',
        type: targetUser.type,
        profilePicture: targetUser.profilePicture,
        pinRequired: targetUser.pinRequired,
        progress: {},
        videoProgress: {},
        adults: targetUser.adultRelationships.map(rel => ({
          id: rel.adult.id,
          name: rel.adult.name,
          email: rel.adult.email!,
          type: rel.adult.type,
          profilePicture: rel.adult.profilePicture,
          relationshipType: rel.type,
          loggedIn: rel.adult.id === currentUser.id
        })),
        pendingInvites: invites,
        birthday: targetUser.birthday ? targetUser.birthday.toString() : null,
        gender: targetUser.gender || null
      };

      return resp.json({
        user: userDTO
      });
    }

    return resp.status(403).json({
      errorCode: 'users.get.noPermission',
      message: 'You cannot view this user profile',
    });
  });

};