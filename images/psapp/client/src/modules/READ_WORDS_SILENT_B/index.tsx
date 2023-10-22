import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import combWord from './comb.wav';
import climbWord from './climb.wav';
import bombWord from './bomb.wav';
import lambWord from './lamb.wav';
import thumbWord from './thumb.wav';
import tombWord from './tomb.wav';
import numbWord from './numb.wav';
import crumbWord from './crumb.wav';
import dumbWord from './dumb.wav';
import subtleWord from './subtle.wav';
import doubtWord from './doubt.wav';
import debtWord from './debt.wav';

export default ModuleBuilder({
  variants: [{
    word: 'comb',
    sounds: [[0, 'k'], [1, 'oLongGo'], [2, 'm']],
    spoken: combWord,
  }, {
    word: 'climb',
    sounds: [[0, 'k'], [1, 'l'], [2, 'iLong'], [3, 'm']],
    spoken: climbWord,
  }, {
    word: 'bomb',
    sounds: [[0, 'b'], [1, 'oShortMom'], [2, 'm']],
    spoken: bombWord,
  }, {
    word: 'lamb',
    sounds: [[0, 'l'], [1, 'aShortAt'], [2, 'm']],
    spoken: lambWord,
  }, {
    word: 'thumb',
    sounds: [[0, 'thThink'], [2, 'uShortDuck'], [3, 'm']],
    spoken: thumbWord,
  }, {
    word: 'tomb',
    sounds: [[0, 't'], [1, 'uLongBlue'], [2, 'm']],
    spoken: tombWord,
  }, {
    word: 'numb',
    sounds: [[0, 'n'], [1, 'uShortDuck'], [2, 'm']],
    spoken: numbWord,
  }, {
    word: 'crumb',
    sounds: [[0, 'k'], [1, 'r'], [2, 'uShortDuck'], [3, 'm']],
    spoken: crumbWord,
  }, {
    word: 'dumb',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [2, 'm']],
    spoken: dumbWord,
  }, {
    word: 'subtle',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 't'], [4, 'l']],
    spoken: subtleWord,
  }, {
    word: 'doubt',
    sounds: [[0, 'd'], [1, 'schwa'], [2, 'uLongBlue'], [3, 't']],
    spoken: doubtWord,
  }, {
    word: 'debt',
    sounds: [[0, 'd'], [1, 'eShort'], [2, 't']],
    spoken: debtWord,
  }],
});

