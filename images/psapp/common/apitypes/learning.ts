import { 
  UserProgressDTOEntry,
  UserVideoProgressDTO,
  VideoProgressDTO,
  VideoProgressEntryDTO,
  ProgressVideoStatus,
  KMId,
  Omit
} from '../types';

export type LearningEndpoints = {
  '/api/learning/progressvideos/:kmid': {
    'get': {
      Params: {
        kmid: KMId,
      },
      Query: never,
      Body: never,
      Response: {
        videos: VideoProgressDTO,
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
        moduleVideos: UserVideoProgressDTO,
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
};