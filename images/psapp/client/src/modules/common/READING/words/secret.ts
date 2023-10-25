import secretWord from './secret.wav';
export default {
  word: 'secret',
  sounds: [[0, 's'], [1, 'eLong'], [2, 'k'], [3, 'r'], [4, 'eShort'], [5, 't']],
  spoken: secretWord
} as const;