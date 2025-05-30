import { ChildInfo, RelationshipType, ProfilePicture } from '../types';

export type ChildrenEndpoints = {
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
};