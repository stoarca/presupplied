import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import whatWord from './what.wav';
import whenWord from './when.wav';
import whoWord from './who.wav';
import whyWord from './why.wav';
import wheelWord from './wheel.wav';
import whichWord from './which.wav';
import wholeWord from './whole.wav';
import holeWord from './hole.wav';
import whoaWord from './whoa.wav';
import anywhereWord from './anywhere.wav';
import somewhereWord from './somewhere.wav';

export default ModuleBuilder({
  variants: [{
    word: 'what',
    sounds: [[0, 'w'], [2, 'schwa'], [3, 't']],
    spoken: whatWord,
  }, {
    word: 'when',
    sounds: [[0, 'w'], [2, 'eShort'], [3, 'n']],
    spoken: whenWord,
  }, {
    word: 'who',
    sounds: [[0, 'h'], [2, 'uLongBlue']],
    spoken: whoWord,
  }, {
    word: 'why',
    sounds: [[0, 'w'], [2, 'iLong']],
    spoken: whyWord,
  }, {
    word: 'wheel',
    sounds: [[0, 'w'], [2, 'eLong'], [4, 'l']],
    spoken: wheelWord,
  }, {
    word: 'which',
    sounds: [[0, 'w'], [2, 'iShort'], [3, 'ch']],
    spoken: whichWord,
  }, {
    word: 'whole',
    sounds: [[0, 'h'], [2, 'oLongMore'], [3, 'l']],
    spoken: wholeWord,
  }, {
    word: 'hole',
    sounds: [[0, 'h'], [1, 'oLongMore'], [2, 'l']],
    spoken: holeWord,
  }, {
    word: 'whoa',
    sounds: [[0, 'w'], [2, 'oLongGo']],
    spoken: whoaWord,
  }, {
    word: 'anywhere',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'eLong'], [3, 'w'], [5, 'eShort'], [6, 'r']],
    spoken: anywhereWord,
  }, {
    word: 'somewhere',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'm'], [4, 'w'], [6, 'eShort'], [7, 'r']],
    spoken: somewhereWord,
  }],
});

