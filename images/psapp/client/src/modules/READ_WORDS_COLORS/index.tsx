import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import redWord from './red.wav';
import blueWord from './blue.wav';
import orangeWord from './orange.wav';
import greenWord from './green.wav';
import violetWord from './violet.wav';
import purpleWord from './purple.wav';
import yellowWord from './yellow.wav';
import brownWord from './brown.wav';
import blackWord from './black.wav';
import whiteWord from './white.wav';
import grayWord from './gray.wav';
import pinkWord from './pink.wav';

export default ModuleBuilder({
  variants: [{
    word: 'red',
    sounds: [[0, 'r'], [1, 'eShort'], [2, 'd']],
    spoken: redWord,
  }, {
    word: 'blue',
    sounds: [[0, 'b'], [1, 'l'], [2, 'uLongBlue']],
    spoken: blueWord,
  }, {
    word: 'orange',
    sounds: [[0, 'oLongMore'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [4, 'j']],
    spoken: orangeWord,
  }, {
    word: 'green',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'eLong'], [3, 'n']],
    spoken: greenWord,
  }, {
    word: 'violet',
    sounds: [[0, 'v'], [1, 'iLong'], [2, 'schwa'], [3, 'l'], [4, 'eShort'], [5, 't']],
    spoken: violetWord,
  }, {
    word: 'purple',
    sounds: [[0, 'p'], [1, 'schwa'], [2, 'r'], [3, 'p'], [4, 'p'], [5, 'l']],
    spoken: purpleWord,
  }, {
    word: 'yellow',
    sounds: [[0, 'yConsonant'], [1, 'eShort'], [3, 'l'], [5, 'oLongGo'], [6, 'w']],
    spoken: yellowWord,
  }, {
    word: 'brown',
    sounds: [[0, 'b'], [1, 'r'], [2, 'oShortOut'], [3, 'w'], [4, 'n']],
    spoken: brownWord,
  }, {
    word: 'black',
    sounds: [[0, 'b'], [1, 'l'], [2, 'aShortAt'], [3, 'k']],
    spoken: blackWord,
  }, {
    word: 'white',
    sounds: [[0, 'w'], [2, 'iLong'], [3, 't']],
    spoken: whiteWord,
  }, {
    word: 'gray',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aLong']],
    spoken: grayWord,
  }, {
    word: 'pink',
    sounds: [[0, 'p'], [1, 'iShort'], [2, 'n'], [3, 'k']],
    spoken: pinkWord,
  }],
});

