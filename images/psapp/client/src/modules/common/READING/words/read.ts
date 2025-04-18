import readWord from './read.wav';
export default {
  word: 'read',
  sounds: [[0, 'r'], [1, 'eLong'], [3, 'd']],
  spoken: readWord
} as const;