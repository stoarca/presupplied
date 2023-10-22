import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import laughWord from './laugh.wav';
import roughWord from './rough.wav';
import toughWord from './tough.wav';
import coughWord from './cough.wav';
import enoughWord from './enough.wav';
import droughtWord from './drought.wav';

export default ModuleBuilder({
  variants: [{
    word: 'laugh',
    sounds: [[0, 'l'], [1, 'aShortAt'], [3, 'f']],
    spoken: laughWord,
  }, {
    word: 'rough',
    sounds: [[0, 'r'], [1, 'uShortDuck'], [3, 'f']],
    spoken: roughWord,
  }, {
    word: 'tough',
    sounds: [[0, 't'], [1, 'uShortDuck'], [3, 'f']],
    spoken: toughWord,
  }, {
    word: 'cough',
    sounds: [[0, 'k'], [1, 'oShortMom'], [3, 'f']],
    spoken: coughWord,
  }, {
    word: 'enough',
    sounds: [[0, 'eLong'], [1, 'n'], [2, 'uShortDuck'], [4, 'f']],
    spoken: enoughWord,
  }, {
    word: 'drought',
    sounds: [[0, 'd'], [1, 'r'], [2, 'oShortOut'], [3, 'uShortFull'], [4, 't']],
    spoken: droughtWord,
  }],
});

