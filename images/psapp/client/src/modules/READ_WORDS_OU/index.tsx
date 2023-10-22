import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import outWord from './out.wav';
import aboutWord from './about.wav';
import loudWord from './loud.wav';
import cloudsWord from './clouds.wav';
import cougarWord from './cougar.wav';
import couchWord from './couch.wav';
import countWord from './count.wav';
import curiousWord from './curious.wav';
import foundWord from './found.wav';
import hourWord from './hour.wav';
import ourWord from './our.wav';
import houseWord from './house.wav';
import doubleWord from './double.wav';

export default ModuleBuilder({
  variants: [{
    word: 'out',
    sounds: [[0, 'oShortOut'], [1, 'uShortFull'], [2, 't']],
    spoken: outWord,
  }, {
    word: 'about',
    sounds: [[0, 'schwa'], [1, 'b'], [2, 'oShortOut'], [3, 'uShortFull'], [4, 't']],
    spoken: aboutWord,
  }, {
    word: 'loud',
    sounds: [[0, 'l'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'd']],
    spoken: loudWord,
  }, {
    word: 'clouds',
    sounds: [[0, 'k'], [1, 'l'], [2, 'oShortOut'], [3, 'uShortFull'], [4, 'd'], [5, 'z']],
    spoken: cloudsWord,
  }, {
    word: 'cougar',
    sounds: [[0, 'k'], [1, 'uLongBlue'], [3, 'gHard'], [4, 'schwa'], [5, 'r']],
    spoken: cougarWord,
  }, {
    word: 'couch',
    sounds: [[0, 'k'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'ch']],
    spoken: couchWord,
  }, {
    word: 'count',
    sounds: [[0, 'k'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'n'], [4, 't']],
    spoken: countWord,
  }, {
    word: 'curious',
    sounds: [[0, 'k'], [1, 'uShortCurious'], [2, 'r'], [3, 'eLong'], [4, 'schwa'], [6, 's']],
    spoken: curiousWord,
  }, {
    word: 'found',
    sounds: [[0, 'f'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'n'], [4, 'd']],
    spoken: foundWord,
  }, {
    word: 'hour',
    sounds: [[0, 'oShortOut'], [2, 'uShortFull'], [3, 'r']],
    spoken: hourWord,
  }, {
    word: 'our',
    sounds: [[0, 'oShortOut'], [1, 'uShortFull'], [2, 'r']],
    spoken: ourWord,
  }, {
    word: 'house',
    sounds: [[0, 'h'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 's']],
    spoken: houseWord,
  }, {
    word: 'double',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [3, 'b'], [4, 'l']],
    spoken: doubleWord,
  }],
});

