import { UserType } from '../types';

export type AuthEndpoints = {
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
};