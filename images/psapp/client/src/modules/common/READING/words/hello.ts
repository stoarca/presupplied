import helloWord from './hello.wav';
export default {
  word: 'hello',
  sounds: [[0, 'h'], [1, 'eShort'], [2, 'l'], [4, 'oLongGo']],
  spoken: helloWord
} as const;
