import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import parkWord from './park.wav';
import playgroundWord from './playground.wav';
import slideWord from './slide.wav';
import swingWord from './swing.wav';
import climbWord from './climb.wav';
import hideWord from './hide.wav';
import tagWord from './tag.wav';
import sandboxWord from './sandbox.wav';
import fountainWord from './fountain.wav';
import benchWord from './bench.wav';
import seesawWord from './seesaw.wav';

export default ModuleBuilder({
  variants: [{
    word: 'park',
    sounds: [[0, 'p'], [1, 'aShortAre'], [2, 'r'], [3, 'k']],
    spoken: parkWord,
  }, {
    word: 'playground',
    sounds: [[0, 'p'], [1, 'l'], [2, 'aLong'], [4, 'gHard'], [5, 'r'], [6, 'oShortOut'], [7, 'uShortFull'], [8, 'n'], [9, 'd']],
    spoken: playgroundWord,
  }, {
    word: 'slide',
    sounds: [[0, 's'], [1, 'l'], [2, 'iLong'], [3, 'd']],
    spoken: slideWord,
  }, {
    word: 'swing',
    sounds: [[0, 's'], [1, 'w'], [2, 'iShort'], [3, 'n'], [4, 'gHard']],
    spoken: swingWord,
  }, {
    word: 'climb',
    sounds: [[0, 'k'], [1, 'l'], [2, 'iLong'], [3, 'm']],
    spoken: climbWord,
  }, {
    word: 'hide',
    sounds: [[0, 'h'], [1, 'iLong'], [2, 'd']],
    spoken: hideWord,
  }, {
    word: 'tag',
    sounds: [[0, 't'], [1, 'aShortAnd'], [2, 'gHard']],
    spoken: tagWord,
  }, {
    word: 'sandbox',
    sounds: [[0, 's'], [1, 'aShortAnd'], [2, 'n'], [3, 'd'], [4, 'b'], [5, 'oShortMom'], [6, 'x']],
    spoken: sandboxWord,
  }, {
    word: 'fountain',
    sounds: [[0, 'f'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'n'], [4, 't'], [6, 'schwa'], [7, 'n']],
    spoken: fountainWord,
  }, {
    word: 'bench',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'n'], [3, 'ch']],
    spoken: benchWord,
  }, {
    word: 'seesaw',
    sounds: [[0, 's'], [1, 'eLong'], [3, 's'], [4, 'aShortAre']],
    spoken: seesawWord,
  }],
});

