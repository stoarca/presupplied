import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import goWord from './go.wav';
import noWord from './no.wav';
import soWord from './so.wav';
import toeWord from './toe.wav';
import moreWord from './more.wav';
import soreWord from './sore.wav';
import fortWord from './fort.wav';
import snowWord from './snow.wav';
import belowWord from './below.wav';
import forkWord from './fork.wav';
import helloWord from './hello.wav';

export default ModuleBuilder({
  variants: [{
    word: 'go',
    sounds: [[0, 'gHard'], [1, 'oLongGo']],
    spoken: goWord,
  }, {
    word: 'no',
    sounds: [[0, 'n'], [1, 'oLongGo']],
    spoken: noWord,
  }, {
    word: 'so',
    sounds: [[0, 's'], [1, 'oLongGo']],
    spoken: soWord,
  }, {
    word: 'toe',
    sounds: [[0, 't'], [1, 'oLongGo']],
    spoken: toeWord,
  }, {
    word: 'more',
    sounds: [[0, 'm'], [1, 'oLongMore'], [2, 'r']],
    spoken: moreWord,
  }, {
    word: 'sore',
    sounds: [[0, 's'], [1, 'oLongMore'], [2, 'r']],
    spoken: soreWord,
  }, {
    word: 'fort',
    sounds: [[0, 'f'], [1, 'oLongMore'], [2, 'r'], [3, 't']],
    spoken: fortWord,
  }, {
    word: 'snow',
    sounds: [[0, 's'], [1, 'n'], [2, 'oLongGo']],
    spoken: snowWord,
  }, {
    word: 'below',
    sounds: [[0, 'b'], [1, 'eLong'], [3, 'oLongGo']],
    spoken: belowWord,
  }, {
    word: 'fork',
    sounds: [[0, 'f'], [1, 'oLongMore'], [2, 'r'], [3, 'k']],
    spoken: forkWord,
  }, {
    word: 'hello',
    sounds: [[0, 'h'], [1, 'eShort'], [3, 'oLongGo']],
    spoken: helloWord,
  }],
});
