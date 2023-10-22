import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import trainWord from './train.wav';
import tripWord from './trip.wav';
import trayWord from './tray.wav';
import trueWord from './true.wav';
import trustWord from './trust.wav';
import trendWord from './trend.wav';
import tribeWord from './tribe.wav';
import trollWord from './troll.wav';
import trickWord from './trick.wav';
import tryWord from './try.wav';

export default ModuleBuilder({
  variants: [{
    word: 'train',
    sounds: [[0, 't'], [1, 'r'], [2, 'aLong'], [4, 'n']],
    spoken: trainWord,
  }, {
    word: 'trip',
    sounds: [[0, 't'], [1, 'r'], [2, 'iShort'], [3, 'p']],
    spoken: tripWord,
  }, {
    word: 'tray',
    sounds: [[0, 't'], [1, 'r'], [2, 'aLong']],
    spoken: trayWord,
  }, {
    word: 'true',
    sounds: [[0, 't'], [1, 'r'], [2, 'uLongBlue']],
    spoken: trueWord,
  }, {
    word: 'trust',
    sounds: [[0, 't'], [1, 'r'], [2, 'uShortDuck'], [3, 's'], [4, 't']],
    spoken: trustWord,
  }, {
    word: 'trend',
    sounds: [[0, 't'], [1, 'r'], [2, 'eShort'], [3, 'n'], [4, 'd']],
    spoken: trendWord,
  }, {
    word: 'tribe',
    sounds: [[0, 't'], [1, 'r'], [2, 'iLong'], [3, 'b']],
    spoken: tribeWord,
  }, {
    word: 'troll',
    sounds: [[0, 't'], [1, 'r'], [2, 'oLongGo'], [3, 'l']],
    spoken: trollWord,
  }, {
    word: 'trick',
    sounds: [[0, 't'], [1, 'r'], [2, 'iShort'], [3, 'k']],
    spoken: trickWord,
  }, {
    word: 'try',
    sounds: [[0, 't'], [1, 'r'], [2, 'iLong']],
    spoken: tryWord,
  }],
});
