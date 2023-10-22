import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import talkWord from './talk.wav';
import walkWord from './walk.wav';
import milkWord from './milk.wav';
import yolkWord from './yolk.wav';
import bulkyWord from './bulky.wav';
import folksWord from './folks.wav';
import hulkWord from './hulk.wav';
import elkWord from './elk.wav';
import silkWord from './silk.wav';

export default ModuleBuilder({
  variants: [{
    word: 'talk',
    sounds: [[0, 't'], [1, 'aShortAre'], [2, 'k']],
    spoken: talkWord,
  }, {
    word: 'walk',
    sounds: [[0, 'w'], [1, 'aShortAre'], [2, 'k']],
    spoken: walkWord,
  }, {
    word: 'milk',
    sounds: [[0, 'm'], [1, 'iShort'], [2, 'l'], [3, 'k']],
    spoken: milkWord,
  }, {
    word: 'yolk',
    sounds: [[0, 'yConsonant'], [1, 'oLongGo'], [2, 'k']],
    spoken: yolkWord,
  }, {
    word: 'bulky',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 'l'], [3, 'k'], [4, 'eLong']],
    spoken: bulkyWord,
  }, {
    word: 'folks',
    sounds: [[0, 'f'], [1, 'oLongGo'], [2, 'k'], [4, 's']],
    spoken: folksWord,
  }, {
    word: 'hulk',
    sounds: [[0, 'h'], [1, 'uShortDuck'], [2, 'l'], [3, 'k']],
    spoken: hulkWord,
  }, {
    word: 'elk',
    sounds: [[0, 'eShort'], [1, 'l'], [2, 'k']],
    spoken: elkWord,
  }, {
    word: 'silk',
    sounds: [[0, 's'], [1, 'iShort'], [2, 'l'], [3, 'k']],
    spoken: silkWord,
  }],
});

