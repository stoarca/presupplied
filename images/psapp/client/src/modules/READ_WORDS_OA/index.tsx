import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import oakWord from './oak.wav';
import oarWord from './oar.wav';
import roadWord from './road.wav';
import goalWord from './goal.wav';
import boatWord from './boat.wav';
import soapWord from './soap.wav';
import toadWord from './toad.wav';
import oatsWord from './oats.wav';
import floatWord from './float.wav';
import toastWord from './toast.wav';
import coastWord from './coast.wav';

export default ModuleBuilder({
  variants: [{
    word: 'oak',
    sounds: [[0, 'oLongGo'], [2, 'k']],
    spoken: oakWord,
  }, {
    word: 'oar',
    sounds: [[0, 'oLongGo'], [2, 'r']],
    spoken: oarWord,
  }, {
    word: 'road',
    sounds: [[0, 'r'], [1, 'oLongGo'], [3, 'd']],
    spoken: roadWord,
  }, {
    word: 'goal',
    sounds: [[0, 'gHard'], [1, 'oLongGo'], [3, 'l']],
    spoken: goalWord,
  }, {
    word: 'boat',
    sounds: [[0, 'b'], [1, 'oLongGo'], [3, 't']],
    spoken: boatWord,
  }, {
    word: 'soap',
    sounds: [[0, 's'], [1, 'oLongGo'], [3, 'p']],
    spoken: soapWord,
  }, {
    word: 'toad',
    sounds: [[0, 't'], [1, 'oLongGo'], [3, 'd']],
    spoken: toadWord,
  }, {
    word: 'oats',
    sounds: [[0, 'oLongGo'], [2, 't'], [3, 's']],
    spoken: oatsWord,
  }, {
    word: 'float',
    sounds: [[0, 'f'], [1, 'l'], [2, 'oLongGo'], [4, 't']],
    spoken: floatWord,
  }, {
    word: 'toast',
    sounds: [[0, 't'], [1, 'oLongGo'], [3, 's'], [4, 't']],
    spoken: toastWord,
  }, {
    word: 'coast',
    sounds: [[0, 'k'], [1, 'oLongGo'], [3, 's'], [4, 't']],
    spoken: coastWord,
  }],
});
