import {
  StudentDTO, StudentProgressDTOEntry, ProgressStatus, KMId, Omit
} from './types';

interface _Endpoint {
  method: 'get' | 'post',
  endpoint: string,
}

export const endpoints = {
  '/api/tts': {
    method: 'get',
    endpoint: '/api/tts',
  },
  '/api/auth/register': {
    method: 'post',
    endpoint: '/api/auth/register',
  },
  '/api/auth/login': {
    method: 'post',
    endpoint: '/api/auth/login',
  },
  '/api/auth/logout': {
    method: 'post',
    endpoint: '/api/auth/logout',
  },
  '/api/student': {
    method: 'get',
    endpoint: '/api/student',
  },
  '/api/learning/events': {
    method: 'post',
    endpoint: '/api/learning/events',
  },
} as const;

export type EndpointKeys = keyof typeof endpoints;

let validateEndpoints: {
  [K in EndpointKeys]: _Endpoint & {endpoint: K}
} = endpoints;

type AudioResponse = any; // TODO figure out what type this is

type _Endpoints = {
  '/api/tts': {
    Params: never,
    Query: {
      text: string,
    },
    Body: never,
    Response: AudioResponse,
  },
  '/api/auth/register': {
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
  '/api/auth/login': {
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
  '/api/auth/logout': {
    Params: never,
    Query: never,
    Body: never,
    Response: {
      success: true,
    },
  },
  '/api/student': {
    Params: never,
    Query: never,
    Body: never,
    Response: {
      student: StudentDTO | null,
    },
  },
  '/api/learning/events': {
    Params: never,
    Query: never,
    Body: {
      modules: {
        [K in KMId]: Omit<StudentProgressDTOEntry, 'status'>
      },
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
};

export type Endpoints = {
  [K in EndpointKeys]: _Endpoints[K] & {
    endpoint: K,
    method: typeof endpoints[K]['method']
  };
};

type CheckExtends<U extends T, T> = T;
type Test = CheckExtends<Endpoints, {
  [K in EndpointKeys]: {
    // verify that every api endpoint defines these 4 keys
    Params: Record<string, string>,
    Query: Record<string, string>,
    Body: Endpoints[K]['method'] extends 'post' ? Record<string, any> : never,
    Response: Record<string, any>,
  }
}>;
let test: Test;

