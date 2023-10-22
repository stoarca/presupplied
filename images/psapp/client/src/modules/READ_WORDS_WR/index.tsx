import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import writeWord from './write.wav';
import wroteWord from './wrote.wav';
import wrapWord from './wrap.wav';
import wrinkleWord from './wrinkle.wav';
import wrongWord from './wrong.wav';
import wreckWord from './wreck.wav';
import wrestleWord from './wrestle.wav';
import wreathWord from './wreath.wav';

export default ModuleBuilder({
  variants: [{
    word: 'write',
    sounds: [[0, 'r'], [2, 'iLong'], [3, 't']],
    spoken: writeWord,
  }, {
    word: 'wrote',
    sounds: [[0, 'r'], [2, 'oLongGo'], [3, 't']],
    spoken: wroteWord,
  }, {
    word: 'wrap',
    sounds: [[0, 'r'], [2, 'aShortAt'], [3, 'p']],
    spoken: wrapWord,
  }, {
    word: 'wrinkle',
    sounds: [[0, 'r'], [2, 'iShort'], [3, 'n'], [4, 'k'], [5, 'l']],
    spoken: wrinkleWord,
  }, {
    word: 'wrong',
    sounds: [[0, 'r'], [2, 'oShortMom'], [3, 'n'], [4, 'gHard']],
    spoken: wrongWord,
  }, {
    word: 'wreck',
    sounds: [[0, 'r'], [2, 'eShort'], [3, 'k']],
    spoken: wreckWord,
  }, {
    word: 'wrestle',
    sounds: [[0, 'r'], [2, 'eShort'], [3, 's'], [4, 'l']],
    spoken: wrestleWord,
  }, {
    word: 'wreath',
    sounds: [[0, 'r'], [2, 'eLong'], [4, 'thThink']],
    spoken: wreathWord,
  }],
});

