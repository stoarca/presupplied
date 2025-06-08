import { 
  UserProgressDTOEntry,
  VideoProgressDTO,
  KMId,
  Omit
} from '../types';

export type LearningEndpoints = {
  '/api/learning/module_progress': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        modules: {
          [K in KMId]: Omit<UserProgressDTOEntry, 'status'>
        },
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
        errorCode: 'learning.event.noUser',
        message: string,
      } | {
        errorCode: 'learning.event.missingStudentId',
        message: string,
        moduleId: string,
      } | {
        errorCode: 'learning.event.unauthorized',
        message: string,
      } | {
        success: true,
      },
    },
  },
  '/api/learning/video_progress': {
    'post': {
      Params: never,
      Query: never,
      Body: {
        videos: VideoProgressDTO,
        onBehalfOfStudentId?: number,
      },
      Response: {
        errorCode: 'learning.video_progress.noLogin',
        message: string,
      } | {
        errorCode: 'learning.video_progress.noUser',
        message: string,
      } | {
        errorCode: 'learning.video_progress.unauthorized',
        message: string,
      } | {
        success: true,
      },
    },
  },
};