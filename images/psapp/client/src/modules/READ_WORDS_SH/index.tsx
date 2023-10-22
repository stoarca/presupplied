import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import brushWord from './brush.wav';
import cashWord from './cash.wav';
import smashWord from './smash.wav';
import crashWord from './crash.wav';
import sheWord from './she.wav';
import dishWord from './dish.wav';
import fishWord from './fish.wav';
import sharkWord from './shark.wav';
import shallowWord from './shallow.wav';
import shareWord from './share.wav';
import sharpWord from './sharp.wav';
import shedWord from './shed.wav';

export default ModuleBuilder({
  variants: [{
    word: 'brush',
    sounds: [[0, 'b'], [1, 'r'], [2, 'uShortDuck'], [3, 'sh']],
    spoken: brushWord,
  }, {
    word: 'cash',
    sounds: [[0, 'k'], [1, 'aShortAt'], [2, 'sh']],
    spoken: cashWord,
  }, {
    word: 'smash',
    sounds: [[0, 's'], [1, 'm'], [2, 'aShortAt'], [3, 'sh']],
    spoken: smashWord,
  }, {
    word: 'crash',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aShortAt'], [3, 'sh']],
    spoken: crashWord,
  }, {
    word: 'she',
    sounds: [[0, 'sh'], [2, 'eLong']],
    spoken: sheWord,
  }, {
    word: 'dish',
    sounds: [[0, 'd'], [1, 'iShort'], [2, 'sh']],
    spoken: dishWord,
  }, {
    word: 'fish',
    sounds: [[0, 'f'], [1, 'iShort'], [2, 'sh']],
    spoken: fishWord,
  }, {
    word: 'shark',
    sounds: [[0, 'sh'], [2, 'aShortAre'], [3, 'r'], [4, 'k']],
    spoken: sharkWord,
  }, {
    word: 'shallow',
    sounds: [[0, 'sh'], [2, 'aShortAt'], [3, 'l'], [5, 'oLongGo']],
    spoken: shallowWord,
  }, {
    word: 'share',
    sounds: [[0, 'sh'], [2, 'aShortAnd'], [3, 'r']],
    spoken: shareWord,
  }, {
    word: 'sharp',
    sounds: [[0, 'sh'], [2, 'aShortAre'], [3, 'r'], [4, 'p']],
    spoken: sharpWord,
  }, {
    word: 'shed',
    sounds: [[0, 'sh'], [2, 'eShort'], [3, 'd']],
    spoken: shedWord,
  }],
});

