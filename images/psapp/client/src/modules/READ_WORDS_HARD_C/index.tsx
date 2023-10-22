import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import clapWord from './clap.wav';
import clipWord from './clip.wav';
import cubeWord from './cube.wav';
import copeWord from './cope.wav';
import campWord from './camp.wav';
import caveWord from './cave.wav';
import coldWord from './cold.wav';
import cordWord from './cord.wav';
import corkWord from './cork.wav';

export default ModuleBuilder({
  variants: [{
    word: 'clap',
    sounds: [[0, 'k'], [1, 'l'], [2, 'aShortAt'], [3, 'p']],
    spoken: clapWord,
  }, {
    word: 'clip',
    sounds: [[0, 'k'], [1, 'l'], [2, 'iShort'], [3, 'p']],
    spoken: clipWord,
  }, {
    word: 'cube',
    sounds: [[0, 'k'], [1, 'uLongMute'], [2, 'b']],
    spoken: cubeWord,
  }, {
    word: 'cope',
    sounds: [[0, 'k'], [1, 'oLongGo'], [2, 'p']],
    spoken: copeWord,
  }, {
    word: 'camp',
    sounds: [[0, 'k'], [1, 'aShortAnd'], [2, 'm'], [3, 'p']],
    spoken: campWord,
  }, {
    word: 'cave',
    sounds: [[0, 'k'], [1, 'aLong'], [2, 'v']],
    spoken: caveWord,
  }, {
    word: 'cold',
    sounds: [[0, 'k'], [1, 'oLongGo'], [2, 'l'], [3, 'd']],
    spoken: coldWord,
  }, {
    word: 'cord',
    sounds: [[0, 'k'], [1, 'oLongMore'], [2, 'r'], [3, 'd']],
    spoken: cordWord,
  }, {
    word: 'cork',
    sounds: [[0, 'k'], [1, 'oLongMore'], [2, 'r'], [3, 'k']],
    spoken: corkWord,
  }],
});
