import { TrainingEvent } from '../types';

export type TrainingEndpoints = {
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