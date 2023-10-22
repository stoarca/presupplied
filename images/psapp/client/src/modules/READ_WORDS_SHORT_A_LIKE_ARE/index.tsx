import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import areWord from './are.wav';
import allWord from './all.wav';
import ballWord from './ball.wav';
import callWord from './call.wav';
import wallWord from './wall.wav';
import fallWord from './fall.wav';
import farWord from './far.wav';
import carWord from './car.wav';
import barWord from './bar.wav';
import mallWord from './mall.wav';
import starWord from './star.wav';

export default ModuleBuilder({
  variants: [{
    word: 'are',
    sounds: [[0, 'aShortAre'], [1, 'r']],
    spoken: areWord,
  }, {
    word: 'all',
    sounds: [[0, 'aShortAre'], [1, 'l']],
    spoken: allWord,
  }, {
    word: 'ball',
    sounds: [[0, 'b'], [1, 'aShortAre'], [2, 'l']],
    spoken: ballWord,
  }, {
    word: 'call',
    sounds: [[0, 'k'], [1, 'aShortAre'], [2, 'l']],
    spoken: callWord,
  }, {
    word: 'wall',
    sounds: [[0, 'w'], [1, 'aShortAre'], [2, 'l']],
    spoken: wallWord,
  }, {
    word: 'fall',
    sounds: [[0, 'f'], [1, 'aShortAre'], [2, 'l']],
    spoken: fallWord,
  }, {
    word: 'far',
    sounds: [[0, 'f'], [1, 'aShortAre'], [2, 'r']],
    spoken: farWord,
  }, {
    word: 'car',
    sounds: [[0, 'k'], [1, 'aShortAre'], [2, 'r']],
    spoken: carWord,
  }, {
    word: 'bar',
    sounds: [[0, 'b'], [1, 'aShortAre'], [2, 'r']],
    spoken: barWord,
  }, {
    word: 'mall',
    sounds: [[0, 'm'], [1, 'aShortAre'], [2, 'l']],
    spoken: mallWord,
  }, {
    word: 'star',
    sounds: [[0, 's'], [1, 't'], [2, 'aShortAre'], [3, 'r']],
    spoken: starWord,
  }],
});
