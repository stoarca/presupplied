import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import andWord from './and.wav';
import sandWord from './sand.wav';
import bandWord from './band.wav';
import landWord from './land.wav';
import canWord from './can.wav';
import manWord from './man.wav';
import fanWord from './fan.wav';
import panWord from './pan.wav';
import ranWord from './ran.wav';
import jamWord from './jam.wav';
import nagWord from './nag.wav';
import tanWord from './tan.wav';

export default ModuleBuilder({
  variants: [{
    word: 'and',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'd']],
    spoken: andWord,
  }, {
    word: 'sand',
    sounds: [[0, 's'], [1, 'aShortAnd'], [2, 'n'], [3, 'd']],
    spoken: sandWord,
  }, {
    word: 'band',
    sounds: [[0, 'b'], [1, 'aShortAnd'], [2, 'n'], [3, 'd']],
    spoken: bandWord,
  }, {
    word: 'land',
    sounds: [[0, 'l'], [1, 'aShortAnd'], [2, 'n'], [3, 'd']],
    spoken: landWord,
  }, {
    word: 'can',
    sounds: [[0, 'k'], [1, 'aShortAnd'], [2, 'n']],
    spoken: canWord,
  }, {
    word: 'man',
    sounds: [[0, 'm'], [1, 'aShortAnd'], [2, 'n']],
    spoken: manWord,
  }, {
    word: 'fan',
    sounds: [[0, 'f'], [1, 'aShortAnd'], [2, 'n']],
    spoken: fanWord,
  }, {
    word: 'pan',
    sounds: [[0, 'p'], [1, 'aShortAnd'], [2, 'n']],
    spoken: panWord,
  }, {
    word: 'ran',
    sounds: [[0, 'r'], [1, 'aShortAnd'], [2, 'n']],
    spoken: ranWord,
  }, {
    word: 'jam',
    sounds: [[0, 'j'], [1, 'aShortAnd'], [2, 'm']],
    spoken: jamWord,
  }, {
    word: 'nag',
    sounds: [[0, 'n'], [1, 'aShortAnd'], [2, 'gHard']],
    spoken: nagWord,
  }, {
    word: 'tan',
    sounds: [[0, 't'], [1, 'aShortAnd'], [2, 'n']],
    spoken: tanWord,
  }],
});
