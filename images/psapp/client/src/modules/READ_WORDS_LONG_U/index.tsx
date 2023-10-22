import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tubeWord from './tube.wav';
import tuneWord from './tune.wav';
import muteWord from './mute.wav';
import muleWord from './mule.wav';
import fluteWord from './flute.wav';
import pruneWord from './prune.wav';
import glueWord from './glue.wav';
import clueWord from './clue.wav';
import rudeWord from './rude.wav';
import ruleWord from './rule.wav';
import trueWord from './true.wav';

export default ModuleBuilder({
  variants: [{
    word: 'tube',
    sounds: [[0, 't'], [1, 'uLongBlue'], [2, 'b']],
    spoken: tubeWord,
  }, {
    word: 'tune',
    sounds: [[0, 't'], [1, 'uLongBlue'], [2, 'n']],
    spoken: tuneWord,
  }, {
    word: 'mute',
    sounds: [[0, 'm'], [1, 'uLongMute'], [2, 't']],
    spoken: muteWord,
  }, {
    word: 'mule',
    sounds: [[0, 'm'], [1, 'uLongMute'], [2, 'l']],
    spoken: muleWord,
  }, {
    word: 'flute',
    sounds: [[0, 'f'], [1, 'l'], [2, 'uLongBlue'], [3, 't']],
    spoken: fluteWord,
  }, {
    word: 'prune',
    sounds: [[0, 'p'], [1, 'r'], [2, 'uLongBlue'], [3, 'n']],
    spoken: pruneWord,
  }, {
    word: 'glue',
    sounds: [[0, 'gHard'], [1, 'l'], [2, 'uLongBlue']],
    spoken: glueWord,
  }, {
    word: 'clue',
    sounds: [[0, 'k'], [1, 'l'], [2, 'uLongBlue']],
    spoken: clueWord,
  }, {
    word: 'rude',
    sounds: [[0, 'r'], [1, 'uLongBlue'], [2, 'd']],
    spoken: rudeWord,
  }, {
    word: 'rule',
    sounds: [[0, 'r'], [1, 'uLongBlue'], [2, 'l']],
    spoken: ruleWord,
  }, {
    word: 'true',
    sounds: [[0, 't'], [1, 'r'], [2, 'uLongBlue']],
    spoken: trueWord,
  }],
});
