import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import beingWord from './being.wav';
import veilWord from './veil.wav';
import veinsWord from './veins.wav';
import heirsWord from './heirs.wav';
import weirdWord from './weird.wav';
import seizeWord from './seize.wav';
import heistWord from './heist.wav';

export default ModuleBuilder({
  variants: [{
    word: 'being',
    sounds: [[0, 'b'], [1, 'eLong'], [2, 'iShort'], [3, 'n'], [4, 'gHard']],
    spoken: beingWord,
  }, {
    word: 'veil',
    sounds: [[0, 'v'], [1, 'aLong'], [3, 'l']],
    spoken: veilWord,
  }, {
    word: 'veins',
    sounds: [[0, 'v'], [1, 'aLong'], [3, 'n'], [4, 's']],
    spoken: veinsWord,
  }, {
    word: 'heirs',
    sounds: [[0, 'eShort'], [3, 'r'], [4, 's']],
    spoken: heirsWord,
  }, {
    word: 'weird',
    sounds: [[0, 'w'], [1, 'eLong'], [2, 'iShort'], [3, 'r'], [4, 'd']],
    spoken: weirdWord,
  }, {
    word: 'seize',
    sounds: [[0, 's'], [1, 'eLong'], [3, 'z']],
    spoken: seizeWord,
  }, {
    word: 'heist',
    sounds: [[0, 'h'], [1, 'iLong'], [3, 's'], [4, 't']],
    spoken: heistWord,
  }],
});
