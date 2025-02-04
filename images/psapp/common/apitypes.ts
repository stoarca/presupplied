import {
  StudentDTO,
  StudentProgressDTOEntry,
  StudentProgressVideoDTO,
  ProgressStatus,
  ProgressVideoStatus,
  KMId,
  Omit,
  TrainingEvent
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
  '/api/student': {
    'get': {
      Params: never,
      Query: never,
      Body: never,
      Response: {
        student: StudentDTO | null,
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
      } | {
        type: 'video',
        moduleVideos: StudentProgressVideoDTO,
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

