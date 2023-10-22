import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import monkeyWord from './monkey.wav';
import horseWord from './horse.wav';
import duckWord from './duck.wav';
import chickenWord from './chicken.wav';
import catWord from './cat.wav';
import mouseWord from './mouse.wav';
import birdWord from './bird.wav';
import snakeWord from './snake.wav';
import bearWord from './bear.wav';
import rabbitWord from './rabbit.wav';

export default ModuleBuilder({
  variants: [{
    word: 'monkey',
    sounds: [[0, 'm'], [1, 'schwa'], [2, 'n'], [3, 'k'], [4, 'eLong']],
    spoken: monkeyWord,
  }, {
    word: 'horse',
    sounds: [[0, 'h'], [1, 'oLongMore'], [2, 'r'], [3, 's']],
    spoken: horseWord,
  }, {
    word: 'duck',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [2, 'k']],
    spoken: duckWord,
  }, {
    word: 'chicken',
    sounds: [[0, 'ch'], [2, 'iShort'], [3, 'k'], [5, 'eShort'], [6, 'n']],
    spoken: chickenWord,
  }, {
    word: 'cat',
    sounds: [[0, 'k'], [1, 'aShortAt'], [2, 't']],
    spoken: catWord,
  }, {
    word: 'mouse',
    sounds: [[0, 'm'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 's']],
    spoken: mouseWord,
  }, {
    word: 'bird',
    sounds: [[0, 'b'], [1, 'schwa'], [2, 'r'], [3, 'd']],
    spoken: birdWord,
  }, {
    word: 'snake',
    sounds: [[0, 's'], [1, 'n'], [2, 'aLong'], [3, 'k']],
    spoken: snakeWord,
  }, {
    word: 'bear',
    sounds: [[0, 'b'], [1, 'eShort'], [3, 'r']],
    spoken: bearWord,
  }, {
    word: 'rabbit',
    sounds: [[0, 'r'], [1, 'aShortAt'], [2, 'b'], [4, 'iShort'], [5, 't']],
    spoken: rabbitWord,
  }],
});

