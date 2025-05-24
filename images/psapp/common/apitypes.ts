import {
  UserProgressDTOEntry,
  UserProgressVideoDTO,
  ProgressStatus,
  ProgressVideoStatus,
  KMId,
  Omit,
  TrainingEvent,
  UserType,
  UserDTO,
  RelationshipType,
  ProfilePicture,
  ChildInfo,
  InvitationDTO,
  AdultInfo
} from './types';

type AudioResponse = any; // TODO figure out what type this is

export type Endpoints = {
  '/api/tts': {
    'get': {
      Params: never,
      Query: {
        text: string,
      },
      Body: never,
      Response: AudioResponse,
    },
  },
  '/api/auth/register': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        email: string,
        name: string,
        password: string,
        type: UserType,
      },
      Response: {
        errorCode: 'auth.register.email.invalid',
        email: string,
        message: string,
      } | {
        errorCode: 'auth.register.email.alreadyRegistered',
        email: string,
        message: string,
      } | {
        success: true,
      },
    },
  },
  '/api/auth/login': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        email: string,
        password: string,
      },
      Response: {
        errorCode: 'auth.login.email.nonexistent',
        email: string,
        message: string,
      } | {
        errorCode: 'auth.login.password.invalid',
        message: string,
      } | {
        errorCode: 'auth.login.password.notset',
        message: string,
      } | {
        success: true,
      },
    },
  },
  '/api/auth/logout': {
    'post': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        success: true,
      },
    },
  },
  '/api/user': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        user: UserDTO | null,
      },
    },
  },
  '/api/auth/switch': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        targetId: string,
        pin?: string,
      },
      Response: {
        success: true,
      } | {
        errorCode: 'auth.switch.notLoggedIn',
        message: string,
      } | {
        errorCode: 'auth.switch.invalidUser',
        message: string,
      } | {
        errorCode: 'auth.switch.invalidPin',
        message: string,
      } | {
        errorCode: 'auth.switch.notRelated',
        message: string,
      } | {
        errorCode: 'auth.switch.notParentOrTeacher',
        message: string,
      },
    },
  },
  '/api/children': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        success: true,
        children: Array<ChildInfo & { relationshipType: RelationshipType }>,
      } | {
        errorCode: 'children.list.notLoggedIn',
        message: string,
      } | {
        errorCode: 'children.list.userNotFound',
        message: string,
      } | {
        errorCode: 'children.list.notParentOrTeacher',
        message: string,
      },
    },
    'post': {
      Params: never,
      Query: never,
      Body: {
        name: string,
        pinRequired?: boolean,
        pin?: string,
        profilePicture?: ProfilePicture,
      },
      Response: {
        success: true,
        childId: number,
      } | {
        errorCode: 'children.create.notLoggedIn',
        message: string,
      } | {
        errorCode: 'children.create.notParentOrTeacher',
        message: string,
      } | {
        errorCode: 'children.create.creationFailed',
        message: string,
      },
    },
  },
  '/api/users/:id': {
    'get': {
      Params: {
        id: string,
      },
      Query: never,
      Body: never,
      Response: {
        user: UserDTO,
      } | {
        errorCode: 'users.get.notLoggedIn',
        message: string,
      } | {
        errorCode: 'users.get.invalidId',
        message: string,
      } | {
        errorCode: 'users.get.userNotFound',
        message: string,
      } | {
        errorCode: 'users.get.noPermission',
        message: string,
      },
    },
    'post': {
      Params: {
        id: string,
      },
      Query: never,
      Body: {
        name?: string,
        profilePicture?: ProfilePicture,
      },
      Response: {
        success: true,
      } | {
        errorCode: 'users.update.notLoggedIn',
        message: string,
      } | {
        errorCode: 'users.update.userNotFound',
        message: string,
      } | {
        errorCode: 'users.update.invalidId',
        message: string,
      } | {
        errorCode: 'users.update.unauthorized',
        message: string,
      },
    },
  },
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
  '/api/learning/progressvideos/:kmid': {
    'get': {
      Params: {
        kmid: KMId,
      },
      Query: never,
      Body: never,
      Response: {
        videos: Record<string, ProgressVideoStatus>,
        success: true,
      } | {
        errorCode: 'learning.progressvideos.noLogin',
        message: string,
      } | {
        errorCode: 'learning.progressvideos.noStudent',
        email: string,
        message: string,
      } | {
        errorCode: 'learning.progressvideos.noModule',
        moduleVanityId: KMId,
        message: string,
      },
    },
  },
  '/api/learning/events': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        type: 'module',
        modules: {
          [K in KMId]: Omit<UserProgressDTOEntry, 'status'>
        },
        onBehalfOfStudentId?: number,
      } | {
        type: 'video',
        moduleVideos: UserProgressVideoDTO,
        onBehalfOfStudentId?: number,
      },
      Response: {
        errorCode: 'learning.event.noLogin',
        message: string,
      } | {
        errorCode: 'learning.event.invalidModules',
        moduleVanityIds: string[],
        message: string,
      } | {
        errorCode: 'learning.event.noStudent',
        email: string,
        message: string,
      } | {
        errorCode: 'learning.event.missingStudentId',
        message: string,
        moduleId: string,
      } | {
        errorCode: 'learning.event.noUser',
        message: string,
      } | {
        errorCode: 'learning.event.unauthorized',
        message: string,
      } | {
        success: true,
      },
    },
  },
  '/api/training/events': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        id: string,
        sequenceId: number,
        webmSoundB64: string,
        events: TrainingEvent[],
      },
      Response: {
        errorCode: 'training.events.tooLate',
        message: string,
      } | {
        success: true,
      },
    },
  },
  '/api/test/get-user-info': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        email: string,
      },
      Response: {
        errorCode: 'test.notTestAccount',
        message: string,
      } | {
        errorCode: 'test.userNotFound', 
        message: string,
      } | {
        success: true,
        user: UserDTO,
      },
    },
  },
  '/api/test/enable': {
    'post': {
      Params: never,
      Query: never,
      Body: {},
      Response: {
        success: true,
        message: string,
        deletedCount: number,
      },
    },
  },
  '/api/test/disable': {
    'post': {
      Params: never,
      Query: never,
      Body: {},
      Response: {
        success: true,
        message: string,
      },
    },
  },
  '/api/test/weblog': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        message: string,
        type: 'log' | 'error',
      },
      Response: {
        success: true,
      },
    },
  },
  '/api/test/weblogdump': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        success: true,
        logs: string[],
      },
    },
  },
  '/api/test/weberrordump': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        success: true,
        errors: string[],
      },
    },
  },
};

export type EndpointKeys = keyof Endpoints;

type CheckExtends<U extends T, T> = T;
type Test = CheckExtends<Endpoints, {
  [K in EndpointKeys]: {
    get?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: never,
      Response: Record<string, any>,
    },
    post?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: Record<string, any>,
      Response: Record<string, any>,
    },
    put?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: Record<string, any>,
      Response: Record<string, any>,
    },
    delete?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: never,
      Response: Record<string, any>,
    },
  }
}>;

export let verifyApiTypes: Test;