import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import oneWord from './one.wav';
import twoWord from './two.wav';
import threeWord from './three.wav';
import fourWord from './four.wav';
import fiveWord from './five.wav';
import sixWord from './six.wav';
import sevenWord from './seven.wav';
import eightWord from './eight.wav';
import nineWord from './nine.wav';
import tenWord from './ten.wav';
import elevenWord from './eleven.wav';
import twelveWord from './twelve.wav';
import thirteenWord from './thirteen.wav';

export default ModuleBuilder({
  variants: [{
    word: 'one',
    sounds: [[0, 'w'], [2, 'n']],
    spoken: oneWord,
  }, {
    word: 'two',
    sounds: [[0, 't'], [1, 'uLongBlue']],
    spoken: twoWord,
  }, {
    word: 'three',
    sounds: [[0, 'thThink'], [2, 'r'], [3, 'eLong']],
    spoken: threeWord,
  }, {
    word: 'four',
    sounds: [[0, 'f'], [1, 'oLongMore'], [3, 'r']],
    spoken: fourWord,
  }, {
    word: 'five',
    sounds: [[0, 'f'], [1, 'iLong'], [2, 'v']],
    spoken: fiveWord,
  }, {
    word: 'six',
    sounds: [[0, 's'], [1, 'iShort'], [2, 'x']],
    spoken: sixWord,
  }, {
    word: 'seven',
    sounds: [[0, 's'], [1, 'eShort'], [2, 'v'], [3, 'eShort'], [4, 'n']],
    spoken: sevenWord,
  }, {
    word: 'eight',
    sounds: [[0, 'aLong'], [2, 't']],
    spoken: eightWord,
  }, {
    word: 'nine',
    sounds: [[0, 'n'], [1, 'iLong'], [2, 'n']],
    spoken: nineWord,
  }, {
    word: 'ten',
    sounds: [[0, 't'], [1, 'eShort'], [2, 'n']],
    spoken: tenWord,
  }, {
    word: 'eleven',
    sounds: [[0, 'iShort'], [1, 'l'], [2, 'eShort'], [3, 'v'], [4, 'eShort'], [5, 'n']],
    spoken: elevenWord,
  }, {
    word: 'twelve',
    sounds: [[0, 't'], [1, 'w'], [2, 'eShort'], [3, 'l'], [4, 'v']],
    spoken: twelveWord,
  }, {
    word: 'thirteen',
    sounds: [[0, 'thThink'], [2, 'schwa'], [3, 'r'], [4, 't'], [5, 'eLong'], [7, 'n']],
    spoken: thirteenWord,
  }],
});

