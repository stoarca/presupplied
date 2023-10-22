import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import firstWord from './first.wav';
import secondWord from './second.wav';
import thirdWord from './third.wav';
import fourthWord from './fourth.wav';
import fifthWord from './fifth.wav';
import sixthWord from './sixth.wav';
import seventhWord from './seventh.wav';
import eighthWord from './eighth.wav';
import ninthWord from './ninth.wav';
import tenthWord from './tenth.wav';
import eleventhWord from './eleventh.wav';
import twelfthWord from './twelfth.wav';
import thirteenthWord from './thirteenth.wav';

export default ModuleBuilder({
  variants: [{
    word: 'first',
    sounds: [[0, 'f'], [1, 'schwa'], [2, 'r'], [3, 's'], [4, 't']],
    spoken: firstWord,
  }, {
    word: 'second',
    sounds: [[0, 's'], [1, 'eShort'], [3, 'k'], [4, 'schwa'], [5, 'n'], [6, 'd']],
    spoken: secondWord,
  }, {
    word: 'third',
    sounds: [[0, 'thThink'], [2, 'schwa'], [3, 'r'], [4, 'd']],
    spoken: thirdWord,
  }, {
    word: 'fourth',
    sounds: [[0, 'f'], [1, 'oLongMore'], [3, 'r'], [4, 'thThink']],
    spoken: fourthWord,
  }, {
    word: 'fifth',
    sounds: [[0, 'f'], [1, 'iShort'], [2, 'f'], [4, 'thThink']],
    spoken: fifthWord,
  }, {
    word: 'sixth',
    sounds: [[0, 's'], [1, 'iShort'], [2, 'x'], [3, 'thThink']],
    spoken: sixthWord,
  }, {
    word: 'seventh',
    sounds: [[0, 's'], [1, 'eShort'], [2, 'v'], [3, 'eShort'], [4, 'n'], [5, 'thThink']],
    spoken: seventhWord,
  }, {
    word: 'eighth',
    sounds: [[0, 'aLong'], [2, 'thThink']],
    spoken: eighthWord,
  }, {
    word: 'ninth',
    sounds: [[0, 'n'], [1, 'iShort'], [2, 'n'], [3, 'thThink']],
    spoken: ninthWord,
  }, {
    word: 'tenth',
    sounds: [[0, 't'], [1, 'eShort'], [2, 'n'], [3, 'thThink']],
    spoken: tenthWord,
  }, {
    word: 'eleventh',
    sounds: [[0, 'iShort'], [1, 'l'], [2, 'eShort'], [3, 'v'], [4, 'eShort'], [5, 'n'], [6, 'thThink']],
    spoken: eleventhWord,
  }, {
    word: 'twelfth',
    sounds: [[0, 't'], [1, 'w'], [2, 'eShort'], [3, 'l'], [4, 'f'], [5, 'thThink']],
    spoken: twelfthWord,
  }, {
    word: 'thirteenth',
    sounds: [[0, 'thThink'], [2, 'schwa'], [3, 'r'], [4, 't'], [5, 'eLong'], [7, 'n'], [8, 'thThink']],
    spoken: thirteenthWord,
  }],
});

