import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import rideWord from './ride.wav';
import timeWord from './time.wav';
import findWord from './find.wav';
import likeWord from './like.wav';
import lineWord from './line.wav';
import mineWord from './mine.wav';
import sideWord from './side.wav';
import wipeWord from './wipe.wav';
import fireWord from './fire.wav';
import bikeWord from './bike.wav';
import lifeWord from './life.wav';
import sizeWord from './size.wav';

export default ModuleBuilder({
  variants: [{
    word: 'ride',
    sounds: [[0, 'r'], [1, 'iLong'], [2, 'd']],
    spoken: rideWord,
  }, {
    word: 'time',
    sounds: [[0, 't'], [1, 'iLong'], [2, 'm']],
    spoken: timeWord,
  }, {
    word: 'find',
    sounds: [[0, 'f'], [1, 'iLong'], [2, 'n'], [3, 'd']],
    spoken: findWord,
  }, {
    word: 'like',
    sounds: [[0, 'l'], [1, 'iLong'], [2, 'k']],
    spoken: likeWord,
  }, {
    word: 'line',
    sounds: [[0, 'l'], [1, 'iLong'], [2, 'n']],
    spoken: lineWord,
  }, {
    word: 'mine',
    sounds: [[0, 'm'], [1, 'iLong'], [2, 'n']],
    spoken: mineWord,
  }, {
    word: 'side',
    sounds: [[0, 's'], [1, 'iLong'], [2, 'd']],
    spoken: sideWord,
  }, {
    word: 'wipe',
    sounds: [[0, 'w'], [1, 'iLong'], [2, 'p']],
    spoken: wipeWord,
  }, {
    word: 'fire',
    sounds: [[0, 'f'], [1, 'iLong'], [2, 'r']],
    spoken: fireWord,
  }, {
    word: 'bike',
    sounds: [[0, 'b'], [1, 'iLong'], [2, 'k']],
    spoken: bikeWord,
  }, {
    word: 'life',
    sounds: [[0, 'l'], [1, 'iLong'], [2, 'f']],
    spoken: lifeWord,
  }, {
    word: 'size',
    sounds: [[0, 's'], [1, 'iLong'], [2, 'z']],
    spoken: sizeWord,
  }],
});
