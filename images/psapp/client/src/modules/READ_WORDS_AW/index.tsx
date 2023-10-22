import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import awakeWord from './awake.wav';
import awayWord from './away.wav';
import awfulWord from './awful.wav';
import aweWord from './awe.wav';
import clawsWord from './claws.wav';
import lawnWord from './lawn.wav';
import strawberryWord from './strawberry.wav';
import lawsWord from './laws.wav';
import awesomeWord from './awesome.wav';
import crawlWord from './crawl.wav';
import lawyerWord from './lawyer.wav';

export default ModuleBuilder({
  variants: [{
    word: 'awake',
    sounds: [[0, 'schwa'], [1, 'w'], [2, 'aLong'], [3, 'k']],
    spoken: awakeWord,
  }, {
    word: 'away',
    sounds: [[0, 'schwa'], [1, 'w'], [2, 'aLong']],
    spoken: awayWord,
  }, {
    word: 'awful',
    sounds: [[0, 'aShortAre'], [2, 'f'], [3, 'uShortFull'], [4, 'l']],
    spoken: awfulWord,
  }, {
    word: 'awe',
    sounds: [[0, 'aShortAre']],
    spoken: aweWord,
  }, {
    word: 'claws',
    sounds: [[0, 'k'], [1, 'l'], [2, 'aShortAre'], [4, 's']],
    spoken: clawsWord,
  }, {
    word: 'lawn',
    sounds: [[0, 'l'], [1, 'aShortAre'], [3, 'n']],
    spoken: lawnWord,
  }, {
    word: 'strawberry',
    sounds: [[0, 's'], [1, 't'], [2, 'r'], [3, 'aShortAre'], [5, 'b'], [6, 'eShort'], [7, 'r'], [9, 'eLong']],
    spoken: strawberryWord,
  }, {
    word: 'laws',
    sounds: [[0, 'l'], [1, 'aShortAre'], [3, 's']],
    spoken: lawsWord,
  }, {
    word: 'awesome',
    sounds: [[0, 'aShortAre'], [3, 's'], [4, 'schwa'], [5, 'm']],
    spoken: awesomeWord,
  }, {
    word: 'crawl',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aShortAre'], [4, 'l']],
    spoken: crawlWord,
  }, {
    word: 'lawyer',
    sounds: [[0, 'l'], [1, 'oLongMore'], [3, 'yConsonant'], [4, 'eShort'], [5, 'r']],
    spoken: lawyerWord,
  }],
});
