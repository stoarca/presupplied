import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import auntWord from './aunt.wav';
import authorWord from './author.wav';
import autoWord from './auto.wav';
import automaticWord from './automatic.wav';
import haulWord from './haul.wav';
import sausageWord from './sausage.wav';
import paulWord from './Paul.wav';
import dinosaurWord from './dinosaur.wav';
import beautifulWord from './beautiful.wav';
import vaultWord from './vault.wav';

export default ModuleBuilder({
  variants: [{
    word: 'aunt',
    sounds: [[0, 'aShortAnd'], [2, 'n'], [3, 't']],
    spoken: auntWord,
  }, {
    word: 'auto',
    sounds: [[0, 'aShortAre'], [2, 't'], [3, 'oLongGo']],
    spoken: autoWord,
  }, {
    word: 'automatic',
    sounds: [[0, 'aShortAre'], [2, 't'], [3, 'oLongGo'], [4, 'm'], [5, 'aShortAt'], [6, 't'], [7, 'iShort'], [8, 'k']],
    spoken: automaticWord,
  }, {
    word: 'haul',
    sounds: [[0, 'h'], [1, 'aShortAre'], [3, 'l']],
    spoken: haulWord,
  }, {
    word: 'sausage',
    sounds: [[0, 's'], [1, 'aShortAre'], [3, 's'], [4, 'aShortAnd'], [5, 'j']],
    spoken: sausageWord,
  }, {
    word: 'Paul',
    sounds: [[0, 'p'], [1, 'aShortAre'], [3, 'l']],
    spoken: paulWord,
  }, {
    word: 'dinosaur',
    sounds: [[0, 'd'], [1, 'iLong'], [2, 'n'], [3, 'oShortMom'], [4, 's'], [5, 'oLongMore'], [7, 'r']],
    spoken: dinosaurWord,
  }, {
    word: 'beautiful',
    sounds: [[0, 'b'], [1, 'eLong'], [3, 'uLongMute'], [4, 't'], [5, 'iShort'], [6, 'f'], [7, 'uShortFull'], [8, 'l']],
    spoken: beautifulWord,
  }, {
    word: 'vault',
    sounds: [[0, 'v'], [1, 'aShortAre'], [3, 'l'], [4, 't']],
    spoken: vaultWord,
  }],
});

