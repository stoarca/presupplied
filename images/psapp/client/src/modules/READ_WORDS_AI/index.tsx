import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import airWord from './air.wav';
import aidWord from './aid.wav';
import aimWord from './aim.wav';
import mailWord from './mail.wav';
import tailWord from './tail.wav';
import againWord from './again.wav';
import stairWord from './stair.wav';
import saidWord from './said.wav';
import rainWord from './rain.wav';
import waitWord from './wait.wav';
import gainWord from './gain.wav';

export default ModuleBuilder({
  variants: [{
    word: 'air',
    sounds: [[0, 'eShort'], [2, 'r']],
    spoken: airWord,
  }, {
    word: 'aid',
    sounds: [[0, 'aLong'], [2, 'd']],
    spoken: aidWord,
  }, {
    word: 'aim',
    sounds: [[0, 'aLong'], [2, 'm']],
    spoken: aimWord,
  }, {
    word: 'mail',
    sounds: [[0, 'm'], [1, 'aLong'], [3, 'l']],
    spoken: mailWord,
  }, {
    word: 'tail',
    sounds: [[0, 't'], [1, 'aLong'], [3, 'l']],
    spoken: tailWord,
  }, {
    word: 'again',
    sounds: [[0, 'schwa'], [1, 'gHard'], [2, 'eShort'], [4, 'n']],
    spoken: againWord,
  }, {
    word: 'stair',
    sounds: [[0, 's'], [1, 't'], [2, 'eShort'], [4, 'r']],
    spoken: stairWord,
  }, {
    word: 'said',
    sounds: [[0, 's'], [1, 'eShort'], [3, 'd']],
    spoken: saidWord,
  }, {
    word: 'rain',
    sounds: [[0, 'r'], [1, 'aLong'], [3, 'n']],
    spoken: rainWord,
  }, {
    word: 'wait',
    sounds: [[0, 'w'], [1, 'aLong'], [3, 't']],
    spoken: waitWord,
  }, {
    word: 'gain',
    sounds: [[0, 'gHard'], [1, 'aLong'], [3, 'n']],
    spoken: gainWord,
  }],
});
