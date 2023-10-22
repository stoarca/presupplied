import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import gymWord from './gym.wav';
import gemWord from './gem.wav';
import germWord from './germ.wav';
import gingerWord from './ginger.wav';
import gelWord from './gel.wav';
import generalWord from './general.wav';
import largeWord from './large.wav';
import angelWord from './angel.wav';
import ageWord from './age.wav';
import logicWord from './logic.wav';
import legendWord from './legend.wav';

export default ModuleBuilder({
  variants: [{
    word: 'gym',
    sounds: [[0, 'j'], [1, 'iShort'], [2, 'm']],
    spoken: gymWord,
  }, {
    word: 'gem',
    sounds: [[0, 'j'], [1, 'eShort'], [2, 'm']],
    spoken: gemWord,
  }, {
    word: 'germ',
    sounds: [[0, 'j'], [1, 'eShort'], [2, 'r'], [3, 'm']],
    spoken: germWord,
  }, {
    word: 'ginger',
    sounds: [[0, 'j'], [1, 'iShort'], [2, 'n'], [3, 'j'], [4, 'eShort'], [5, 'r']],
    spoken: gingerWord,
  }, {
    word: 'gel',
    sounds: [[0, 'j'], [1, 'eShort'], [2, 'l']],
    spoken: gelWord,
  }, {
    word: 'general',
    sounds: [[0, 'j'], [1, 'eShort'], [2, 'n'], [3, 'eShort'], [4, 'r'], [5, 'aShortAre'], [6, 'l']],
    spoken: generalWord,
  }, {
    word: 'large',
    sounds: [[0, 'l'], [1, 'aShortAre'], [2, 'r'], [3, 'j']],
    spoken: largeWord,
  }, {
    word: 'angel',
    sounds: [[0, 'aLong'], [1, 'n'], [2, 'j'], [3, 'eShort'], [4, 'l']],
    spoken: angelWord,
  }, {
    word: 'age',
    sounds: [[0, 'aLong'], [1, 'j']],
    spoken: ageWord,
  }, {
    word: 'logic',
    sounds: [[0, 'l'], [1, 'oShortMom'], [2, 'j'], [3, 'iShort'], [4, 'k']],
    spoken: logicWord,
  }, {
    word: 'legend',
    sounds: [[0, 'l'], [1, 'eShort'], [2, 'j'], [3, 'eShort'], [4, 'n'], [5, 'd']],
    spoken: legendWord,
  }],
});
