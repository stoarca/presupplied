import { RelationshipType, UserType, ProfilePicture } from '../types';

export type InvitationsEndpoints = {
  '/api/invitations': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        success: true,
        invitations: Array<{
          id: number,
          inviterUser: {
            id: number,
            name: string,
            email: string,
            type: UserType,
          },
          childUser: {
            id: number,
            name: string,
            profilePicture?: ProfilePicture,
          },
          inviteeEmail: string,
          relationshipType: RelationshipType,
          status: string,
          createdAt: Date,
          expiresAt?: Date,
          token: string,
          adults: Array<{
            id: number,
            name: string,
            email: string,
            type: UserType,
            relationshipType: RelationshipType,
          }>,
        }>,
      } | {
        errorCode: 'invitations.list.notLoggedIn',
        message: string,
      } | {
        errorCode: 'invitations.list.userNotFound',
        message: string,
      } | {
        errorCode: 'invitations.list.unauthorized',
        message: string,
      },
    },
    'post': {
      Params: never,
      Query: never,
      Body: {
        childId: number,
        inviteeEmail: string,
        relationshipType: RelationshipType,
      },
      Response: {
        success: true,
        invitationId: number,
        token: string,
      } | {
        errorCode: 'invitations.create.notLoggedIn',
        message: string,
      } | {
        errorCode: 'invitations.create.invalidEmail',
        message: string,
      } | {
        errorCode: 'invitations.create.userNotFound',
        message: string,
      } | {
        errorCode: 'invitations.create.notParentOrTeacher',
        message: string,
      } | {
        errorCode: 'invitations.create.invalidChildId',
        message: string,
      } | {
        errorCode: 'invitations.create.noRelationship',
        message: string,
      } | {
        errorCode: 'invitations.create.notPrimary',
        message: string,
      } | {
        errorCode: 'invitations.create.selfInvite',
        message: string,
      } | {
        errorCode: 'invitations.create.relationshipExists',
        message: string,
      } | {
        errorCode: 'invitations.create.pendingExists',
        message: string,
      } | {
        errorCode: 'invitations.create.failed',
        message: string,
      },
    },
  },
  '/api/invitations/:id': {
    'post': {
      Params: {
        id: string,
      },
      Query: never,
      Body: {
        action: 'accept' | 'reject',
      },
      Response: {
        success: true,
        action: 'accepted' | 'rejected',
      } | {
        errorCode: 'invitations.update.notLoggedIn',
        message: string,
      } | {
        errorCode: 'invitations.update.invalidId',
        message: string,
      } | {
        errorCode: 'invitations.update.invalidAction',
        message: string,
      } | {
        errorCode: 'invitations.update.userNotFound',
        message: string,
      } | {
        errorCode: 'invitations.update.notFound',
        message: string,
      } | {
        errorCode: 'invitations.update.expired',
        message: string,
      } | {
        errorCode: 'invitations.update.relationshipExists',
        message: string,
      } | {
        errorCode: 'invitations.update.failed',
        message: string,
      },
    },
  },
};