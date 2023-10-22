import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import sapWord from './sap.wav';
import setWord from './set.wav';
import napsWord from './naps.wav';
import stemWord from './stem.wav';
import attacksWord from './attacks.wav';
import cooksWord from './cooks.wav';
import weeksWord from './weeks.wav';
import clapsWord from './claps.wav';
import bootsWord from './boots.wav';
import eatsWord from './eats.wav';
import bathsWord from './baths.wav';
import birthsWord from './births.wav';

export default ModuleBuilder({
  variants: [{
    word: 'sap',
    sounds: [[0, 's'], [1, 'aShortAt'], [2, 'p']],
    spoken: sapWord,
  }, {
    word: 'set',
    sounds: [[0, 's'], [1, 'eShort'], [2, 't']],
    spoken: setWord,
  }, {
    word: 'naps',
    sounds: [[0, 'n'], [1, 'aShortAt'], [2, 'p'], [3, 's']],
    spoken: napsWord,
  }, {
    word: 'stem',
    sounds: [[0, 's'], [1, 't'], [2, 'eShort'], [3, 'm']],
    spoken: stemWord,
  }, {
    word: 'attacks',
    sounds: [[0, 'aShortAt'], [1, 't'], [3, 'aShortAt'], [4, 'k'], [6, 's']],
    spoken: attacksWord,
  }, {
    word: 'cooks',
    sounds: [[0, 'k'], [1, 'uShortFull'], [3, 'k'], [4, 's']],
    spoken: cooksWord,
  }, {
    word: 'weeks',
    sounds: [[0, 'w'], [1, 'eLong'], [3, 'k'], [4, 's']],
    spoken: weeksWord,
  }, {
    word: 'claps',
    sounds: [[0, 'k'], [1, 'l'], [2, 'aShortAt'], [3, 'p'], [4, 's']],
    spoken: clapsWord,
  }, {
    word: 'boots',
    sounds: [[0, 'b'], [1, 'uLongBlue'], [3, 't'], [4, 's']],
    spoken: bootsWord,
  }, {
    word: 'eats',
    sounds: [[0, 'eLong'], [2, 't'], [3, 's']],
    spoken: eatsWord,
  }, {
    word: 'baths',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'thThink'], [4, 's']],
    spoken: bathsWord,
  }, {
    word: 'births',
    sounds: [[0, 'b'], [1, 'schwa'], [2, 'r'], [3, 'thThink'], [5, 's']],
    spoken: birthsWord,
  }],
});

