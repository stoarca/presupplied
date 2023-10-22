import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import hatWord from './hat.wav';
import matWord from './mat.wav';
import patWord from './pat.wav';
import batWord from './bat.wav';
import atWord from './at.wav';
import palWord from './pal.wav';
import dadWord from './dad.wav';
import hadWord from './had.wav';
import badWord from './bad.wav';
import madWord from './mad.wav';
import crabWord from './crab.wav';
import ladWord from './lad.wav';
import padWord from './pad.wav';
import labWord from './lab.wav';

export default ModuleBuilder({
  variants: [{
    word: 'hat',
    sounds: [[0, 'h'], [1, 'aShortAt'], [2, 't']],
    spoken: hatWord,
  }, {
    word: 'mat',
    sounds: [[0, 'm'], [1, 'aShortAt'], [2, 't']],
    spoken: matWord,
  }, {
    word: 'pat',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 't']],
    spoken: patWord,
  }, {
    word: 'bat',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 't']],
    spoken: batWord,
  }, {
    word: 'at',
    sounds: [[0, 'aShortAt'], [1, 't']],
    spoken: atWord,
  }, {
    word: 'pal',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 'l']],
    spoken: palWord,
  }, {
    word: 'dad',
    sounds: [[0, 'd'], [1, 'aShortAt'], [2, 'd']],
    spoken: dadWord,
  }, {
    word: 'had',
    sounds: [[0, 'h'], [1, 'aShortAt'], [2, 'd']],
    spoken: hadWord,
  }, {
    word: 'bad',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'd']],
    spoken: badWord,
  }, {
    word: 'mad',
    sounds: [[0, 'm'], [1, 'aShortAt'], [2, 'd']],
    spoken: madWord,
  }, {
    word: 'crab',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aShortAt'], [3, 'b']],
    spoken: crabWord,
  }, {
    word: 'lad',
    sounds: [[0, 'l'], [1, 'aShortAt'], [2, 'd']],
    spoken: ladWord,
  }, {
    word: 'pad',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 'd']],
    spoken: padWord,
  }, {
    word: 'lab',
    sounds: [[0, 'l'], [1, 'aShortAt'], [2, 'b']],
    spoken: labWord,
  }],
});

