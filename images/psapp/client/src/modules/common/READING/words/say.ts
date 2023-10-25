import sayWord from './say.wav';
export default {
  word: 'say',
  sounds: [[0, 's'], [1, 'aLong']],
  spoken: sayWord
} as const;