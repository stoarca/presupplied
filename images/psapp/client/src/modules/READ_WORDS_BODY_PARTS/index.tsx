import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import armsWord from './arms.wav';
import legsWord from './legs.wav';
import shouldersWord from './shoulders.wav';
import headWord from './head.wav';
import hairWord from './hair.wav';
import feetWord from './feet.wav';
import elbowsWord from './elbows.wav';
import kneesWord from './knees.wav';
import anklesWord from './ankles.wav';
import eyesWord from './eyes.wav';
import noseWord from './nose.wav';
import mouthWord from './mouth.wav';
import earsWord from './ears.wav';

export default ModuleBuilder({
  variants: [{
    word: 'arms',
    sounds: [[0, 'aShortAre'], [1, 'r'], [2, 'm'], [3, 'z']],
    spoken: armsWord,
  }, {
    word: 'legs',
    sounds: [[0, 'l'], [1, 'eShort'], [2, 'gHard'], [3, 'z']],
    spoken: legsWord,
  }, {
    word: 'shoulders',
    sounds: [[0, 'sh'], [2, 'oLongMore'], [4, 'l'], [5, 'd'], [6, 'schwa'], [7, 'r'], [8, 'z']],
    spoken: shouldersWord,
  }, {
    word: 'head',
    sounds: [[0, 'h'], [1, 'eShort'], [3, 'd']],
    spoken: headWord,
  }, {
    word: 'hair',
    sounds: [[0, 'h'], [1, 'eShort'], [3, 'r']],
    spoken: hairWord,
  }, {
    word: 'feet',
    sounds: [[0, 'f'], [1, 'eLong'], [3, 't']],
    spoken: feetWord,
  }, {
    word: 'elbows',
    sounds: [[0, 'eShort'], [1, 'l'], [2, 'b'], [3, 'oLongGo'], [4, 'w'], [5, 'z']],
    spoken: elbowsWord,
  }, {
    word: 'knees',
    sounds: [[0, 'n'], [2, 'eLong'], [4, 'z']],
    spoken: kneesWord,
  }, {
    word: 'ankles',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'k'], [3, 'l'], [5, 'z']],
    spoken: anklesWord,
  }, {
    word: 'eyes',
    sounds: [[0, 'iLong'], [3, 'z']],
    spoken: eyesWord,
  }, {
    word: 'nose',
    sounds: [[0, 'n'], [1, 'oLongGo'], [2, 'z']],
    spoken: noseWord,
  }, {
    word: 'mouth',
    sounds: [[0, 'm'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'thThink']],
    spoken: mouthWord,
  }, {
    word: 'ears',
    sounds: [[0, 'eLong'], [2, 'r'], [3, 'z']],
    spoken: earsWord,
  }],
});

