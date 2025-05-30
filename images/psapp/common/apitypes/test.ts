import { UserDTO } from '../types';

export type TestEndpoints = {
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