import express from 'express';
import crypto from 'crypto';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { UserRelationship } from '../entity/UserRelationship';
import { UserInvitation, InvitationStatus } from '../entity/UserInvitation';
import {
  UserType,
  RelationshipType,
  InvitationDTO
} from '../../../common/types';
import { typedGet, typedPost } from '../typedRoutes';
import { isValidEmail } from '../utils';

const generateInvitationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const setupInvitationRoutes = (router: express.Router) => {
  
  typedPost(router, '/api/invitations', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'invitations.create.notLoggedIn',
        message: 'You need to be logged in to create invitations',
      });
    }

    if (!isValidEmail(req.body.inviteeEmail)) {
      return resp.status(400).json({
        errorCode: 'invitations.create.invalidEmail',
        message: 'Invalid email address',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const inviterUser = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!inviterUser) {
      return resp.status(401).json({
        errorCode: 'invitations.create.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }

    if (inviterUser.type !== UserType.PARENT && inviterUser.type !== UserType.TEACHER) {
      return resp.status(403).json({
        errorCode: 'invitations.create.notParentOrTeacher',
        message: 'Only parent or teacher accounts can create invitations',
      });
    }

    const childId = req.body.childId;
    if (typeof childId !== 'number' || isNaN(childId)) {
      return resp.status(400).json({
        errorCode: 'invitations.create.invalidChildId',
        message: 'Invalid child ID format',
      });
    }

    const relationshipRepo = AppDataSource.getRepository(UserRelationship);
    const relationship = await relationshipRepo.findOne({
      where: {
        adultId: inviterUser.id,
        childId: childId
      },
      relations: ['child']
    });

    if (!relationship) {
      return resp.status(403).json({
        errorCode: 'invitations.create.noRelationship',
        message: 'No relationship exists with this child',
      });
    }

    if (relationship.type !== RelationshipType.PRIMARY) {
      return resp.status(403).json({
        errorCode: 'invitations.create.notPrimary',
        message: 'Only primary relationships can invite others',
      });
    }

    if (req.body.inviteeEmail === inviterUser.email) {
      return resp.status(400).json({
        errorCode: 'invitations.create.selfInvite',
        message: 'Cannot invite yourself',
      });
    }

    const inviteeUser = await userRepo.findOne({
      where: { email: req.body.inviteeEmail }
    });

    if (inviteeUser) {
      const existingRelationship = await relationshipRepo.findOne({
        where: {
          adultId: inviteeUser.id,
          childId: childId
        }
      });

      if (existingRelationship) {
        return resp.status(400).json({
          errorCode: 'invitations.create.relationshipExists',
          message: 'User already has a relationship with this child',
        });
      }
    }

    const invitationRepo = AppDataSource.getRepository(UserInvitation);
    const existingInvitation = await invitationRepo.findOne({
      where: {
        inviteeEmail: req.body.inviteeEmail,
        childId: childId,
        status: InvitationStatus.PENDING
      }
    });

    if (existingInvitation) {
      return resp.status(400).json({
        errorCode: 'invitations.create.pendingExists',
        message: 'A pending invitation already exists for this email and child',
      });
    }

    try {
      const invitation = new UserInvitation({
        inviterUser: inviterUser,
        childUser: relationship.child,
        inviteeEmail: req.body.inviteeEmail,
        relationshipType: req.body.relationshipType || RelationshipType.OBSERVER
      });

      invitation.token = generateInvitationToken();
      invitation.inviteeUser = inviteeUser || undefined;
      invitation.inviteeUserId = inviteeUser?.id || undefined;

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      invitation.expiresAt = expirationDate;

      await invitationRepo.save(invitation);

      return resp.json({
        success: true,
        invitationId: invitation.id,
        token: invitation.token
      });
    } catch (error) {
      console.error('Error creating invitation:', error);
      return resp.status(500).json({
        errorCode: 'invitations.create.failed',
        message: 'Failed to create invitation',
      });
    }
  });

  typedGet(router, '/api/invitations', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'invitations.list.notLoggedIn',
        message: 'You need to be logged in to view invitations',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!user) {
      return resp.status(401).json({
        errorCode: 'invitations.list.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }
    
    if (user.type === UserType.STUDENT) {
      return resp.status(403).json({
        errorCode: 'invitations.list.unauthorized',
        message: 'Student accounts cannot view invitations',
      });
    }

    const invitationRepo = AppDataSource.getRepository(UserInvitation);
    const pendingInvitations = await invitationRepo.find({
      where: {
        inviteeEmail: user.email,
        status: InvitationStatus.PENDING
      },
      relations: ['inviterUser', 'childUser']
    });

    const validInvitations = pendingInvitations.filter(invitation => {
      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        invitation.status = InvitationStatus.EXPIRED;
        invitationRepo.save(invitation);
        return false;
      }
      return true;
    });

    const relationshipRepo = AppDataSource.getRepository(UserRelationship);
    const invitationsWithAdults = await Promise.all(
      validInvitations.map(async (invitation) => {
        const adults = await relationshipRepo.find({
          where: {
            childId: invitation.childId
          },
          relations: ['adult']
        });

        return {
          id: invitation.id,
          inviterUser: {
            id: invitation.inviterUser.id,
            name: invitation.inviterUser.name,
            email: invitation.inviterUser.email!,
            type: invitation.inviterUser.type
          },
          childUser: {
            id: invitation.childUser.id,
            name: invitation.childUser.name,
            profilePicture: invitation.childUser.profilePicture
          },
          inviteeEmail: invitation.inviteeEmail,
          relationshipType: invitation.relationshipType,
          status: invitation.status,
          createdAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
          token: invitation.token,
          adults: adults.map(rel => ({
            id: rel.adult.id,
            name: rel.adult.name,
            email: rel.adult.email!,
            type: rel.adult.type,
            relationshipType: rel.type
          }))
        };
      })
    );

    return resp.json({
      success: true,
      invitations: invitationsWithAdults
    });
  });

  typedPost(router, '/api/invitations/:id', async (req, resp) => {
    if (!req.jwtUser) {
      return resp.status(401).json({
        errorCode: 'invitations.update.notLoggedIn',
        message: 'You need to be logged in to update invitations',
      });
    }

    const invitationId = parseInt(req.params.id);
    if (isNaN(invitationId)) {
      return resp.status(400).json({
        errorCode: 'invitations.update.invalidId',
        message: 'Invalid invitation ID format',
      });
    }

    const action = req.body.action;
    if (action !== 'accept' && action !== 'reject') {
      return resp.status(400).json({
        errorCode: 'invitations.update.invalidAction',
        message: 'Action must be "accept" or "reject"',
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: req.jwtUser.email }
    });

    if (!user) {
      return resp.status(401).json({
        errorCode: 'invitations.update.userNotFound',
        message: 'Could not find the logged-in user',
      });
    }

    const invitationRepo = AppDataSource.getRepository(UserInvitation);
    const invitation = await invitationRepo.findOne({
      where: {
        id: invitationId,
        inviteeEmail: user.email,
        status: InvitationStatus.PENDING
      },
      relations: ['childUser']
    });

    if (!invitation) {
      return resp.status(404).json({
        errorCode: 'invitations.update.notFound',
        message: 'Invitation not found or not pending',
      });
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      invitation.status = InvitationStatus.EXPIRED;
      await invitationRepo.save(invitation);
      return resp.status(400).json({
        errorCode: 'invitations.update.expired',
        message: 'Invitation has expired',
      });
    }

    if (action === 'accept') {
      const relationshipRepo = AppDataSource.getRepository(UserRelationship);
      const existingRelationship = await relationshipRepo.findOne({
        where: {
          adultId: user.id,
          childId: invitation.childId
        }
      });

      if (existingRelationship) {
        invitation.status = InvitationStatus.ACCEPTED;
        await invitationRepo.save(invitation);
        return resp.status(400).json({
          errorCode: 'invitations.update.relationshipExists',
          message: 'You already have a relationship with this child',
        });
      }

      try {
        const relationship = new UserRelationship();
        relationship.adultId = user.id;
        relationship.childId = invitation.childId;
        relationship.type = invitation.relationshipType;

        await relationshipRepo.save(relationship);

        invitation.status = InvitationStatus.ACCEPTED;
        invitation.inviteeUser = user;
        invitation.inviteeUserId = user.id;
        await invitationRepo.save(invitation);

        return resp.json({
          success: true,
          action: 'accepted'
        });
      } catch (error) {
        console.error('Error accepting invitation:', error);
        return resp.status(500).json({
          errorCode: 'invitations.update.failed',
          message: 'Failed to accept invitation',
        });
      }
    } else {
      invitation.status = InvitationStatus.REJECTED;
      invitation.inviteeUser = user;
      invitation.inviteeUserId = user.id;
      await invitationRepo.save(invitation);

      return resp.json({
        success: true,
        action: 'rejected'
      });
    }
  });
};