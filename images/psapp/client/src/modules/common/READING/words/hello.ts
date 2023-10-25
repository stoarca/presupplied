import helloWord from './hello.wav';
export default {
  word: 'hello',
  sounds: [[0, 'h'], [1, 'eShort'], [3, 'oLongGo']],
  spoken: helloWord
} as const;