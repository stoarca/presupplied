import {
  StudentDTO,
  StudentProgressDTOEntry,
  StudentProgressVideoDTO,
  ProgressStatus,
  ProgressVideoStatus,
  KMId,
  Omit,
  TrainingEvent,
  UserType,
  UserDTO,
  RelationshipType
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
  '/api/user/switch': {
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
        errorCode: 'user.switch.notLoggedIn',
        message: string,
      } | {
        errorCode: 'user.switch.invalidUser',
        message: string,
      } | {
        errorCode: 'user.switch.invalidPin',
        message: string,
      } | {
        errorCode: 'user.switch.notRelated',
        message: string,
      } | {
        errorCode: 'user.switch.notParentOrTeacher',
        message: string,
      },
    },
  },
  '/api/user/children': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        name: string,
        pinRequired?: boolean,
        pin?: string,
        profilePicture?: {
          image: string,
          background: string
        },
      },
      Response: {
        success: true,
        childId: number,
      } | {
        errorCode: 'user.children.notLoggedIn',
        message: string,
      } | {
        errorCode: 'user.children.notParentOrTeacher',
        message: string,
      } | {
        errorCode: 'user.children.creationFailed',
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
          [K in KMId]: Omit<StudentProgressDTOEntry, 'status'>
        },
        onBehalfOfStudentId?: number,
      } | {
        type: 'video',
        moduleVideos: StudentProgressVideoDTO,
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
        children?: Array<{
          id: number,
          name: string,
          email: string,
          type: UserType,
          pinRequired: boolean,
        }>,
      },
    },
  },
  '/api/test/delete-test-accounts': {
    'post': {
      Params: never,
      Query: never,
      Body: {},
      Response: {
        success: true,
        deletedCount: number,
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