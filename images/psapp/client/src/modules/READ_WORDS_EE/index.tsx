import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import seeWord from './see.wav';
import beeWord from './bee.wav';
import sweetWord from './sweet.wav';
import eelWord from './eel.wav';
import sweepWord from './sweep.wav';
import peelWord from './peel.wav';
import feelWord from './feel.wav';
import needWord from './need.wav';
import freeWord from './free.wav';
import feedWord from './feed.wav';
import sleepWord from './sleep.wav';

export default ModuleBuilder({
  variants: [{
    word: 'see',
    sounds: [[0, 's'], [1, 'eLong']],
    spoken: seeWord,
  }, {
    word: 'bee',
    sounds: [[0, 'b'], [1, 'eLong']],
    spoken: beeWord,
  }, {
    word: 'sweet',
    sounds: [[0, 's'], [1, 'w'], [2, 'eLong'], [4, 't']],
    spoken: sweetWord,
  }, {
    word: 'eel',
    sounds: [[0, 'eLong'], [2, 'l']],
    spoken: eelWord,
  }, {
    word: 'sweep',
    sounds: [[0, 's'], [1, 'w'], [2, 'eLong'], [4, 'p']],
    spoken: sweepWord,
  }, {
    word: 'peel',
    sounds: [[0, 'p'], [1, 'eLong'], [3, 'l']],
    spoken: peelWord,
  }, {
    word: 'feel',
    sounds: [[0, 'f'], [1, 'eLong'], [3, 'l']],
    spoken: feelWord,
  }, {
    word: 'need',
    sounds: [[0, 'n'], [1, 'eLong'], [3, 'd']],
    spoken: needWord,
  }, {
    word: 'free',
    sounds: [[0, 'f'], [1, 'r'], [2, 'eLong']],
    spoken: freeWord,
  }, {
    word: 'feed',
    sounds: [[0, 'f'], [1, 'eLong'], [3, 'd']],
    spoken: feedWord,
  }, {
    word: 'sleep',
    sounds: [[0, 's'], [1, 'l'], [2, 'eLong'], [4, 'p']],
    spoken: sleepWord,
  }],
});
