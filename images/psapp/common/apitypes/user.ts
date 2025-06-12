import { UserDTO, ProfilePicture, Gender } from '../types';

export type UserEndpoints = {
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
        birthday?: string | null,
        gender?: Gender | null,
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
};