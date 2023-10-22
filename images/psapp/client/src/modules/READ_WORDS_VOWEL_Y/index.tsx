import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import skyWord from './sky.wav';
import flyWord from './fly.wav';
import myWord from './my.wav';
import byWord from './by.wav';
import tryWord from './try.wav';
import cryWord from './cry.wav';
import fryWord from './fry.wav';
import anyWord from './any.wav';
import armyWord from './army.wav';
import applyWord from './apply.wav';
import babyWord from './baby.wav';

export default ModuleBuilder({
  variants: [{
    word: 'sky',
    sounds: [[0, 's'], [1, 'k'], [2, 'iLong']],
    spoken: skyWord,
  }, {
    word: 'fly',
    sounds: [[0, 'f'], [1, 'l'], [2, 'iLong']],
    spoken: flyWord,
  }, {
    word: 'my',
    sounds: [[0, 'm'], [1, 'iLong']],
    spoken: myWord,
  }, {
    word: 'by',
    sounds: [[0, 'b'], [1, 'iLong']],
    spoken: byWord,
  }, {
    word: 'try',
    sounds: [[0, 't'], [1, 'r'], [2, 'iLong']],
    spoken: tryWord,
  }, {
    word: 'cry',
    sounds: [[0, 'k'], [1, 'r'], [2, 'iLong']],
    spoken: cryWord,
  }, {
    word: 'fry',
    sounds: [[0, 'f'], [1, 'r'], [2, 'iLong']],
    spoken: fryWord,
  }, {
    word: 'any',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'eLong']],
    spoken: anyWord,
  }, {
    word: 'army',
    sounds: [[0, 'aShortAre'], [1, 'r'], [2, 'm'], [3, 'eLong']],
    spoken: armyWord,
  }, {
    word: 'apply',
    sounds: [[0, 'schwa'], [1, 'p'], [2, 'l'], [3, 'iLong']],
    spoken: applyWord,
  }, {
    word: 'baby',
    sounds: [[0, 'b'], [1, 'aLong'], [2, 'b'], [3, 'eLong']],
    spoken: babyWord,
  }],
});
