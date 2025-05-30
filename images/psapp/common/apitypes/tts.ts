type AudioResponse = any; // TODO figure out what type this is

export type TtsEndpoints = {
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
};