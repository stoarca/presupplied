import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import ovenWord from './oven.wav';
import fridgeWord from './fridge.wav';
import freezerWord from './freezer.wav';
import cupboardWord from './cupboard.wav';
import counterWord from './counter.wav';
import stoveWord from './stove.wav';
import toasterWord from './toaster.wav';
import kettleWord from './kettle.wav';
import spoonWord from './spoon.wav';
import forkWord from './fork.wav';
import plateWord from './plate.wav';
import bowlWord from './bowl.wav';

export default ModuleBuilder({
  variants: [{
    word: 'oven',
    sounds: [[0, 'uShortDuck'], [1, 'v'], [2, 'eShort'], [3, 'n']],
    spoken: ovenWord,
  }, {
    word: 'fridge',
    sounds: [[0, 'f'], [1, 'r'], [2, 'iShort'], [3, 'j']],
    spoken: fridgeWord,
  }, {
    word: 'freezer',
    sounds: [[0, 'f'], [1, 'r'], [2, 'eLong'], [4, 'z'], [5, 'schwa'], [6, 'r']],
    spoken: freezerWord,
  }, {
    word: 'cupboard',
    sounds: [[0, 'k'], [1, 'uShortDuck'], [2, 'b'], [4, 'schwa'], [6, 'r'], [7, 'd']],
    spoken: cupboardWord,
  }, {
    word: 'counter',
    sounds: [[0, 'k'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 'n'], [4, 't'], [5, 'schwa'], [6, 'r']],
    spoken: counterWord,
  }, {
    word: 'stove',
    sounds: [[0, 's'], [1, 't'], [2, 'oLongGo'], [3, 'v']],
    spoken: stoveWord,
  }, {
    word: 'toaster',
    sounds: [[0, 't'], [1, 'oLongGo'], [3, 's'], [4, 't'], [5, 'schwa'], [6, 'r']],
    spoken: toasterWord,
  }, {
    word: 'kettle',
    sounds: [[0, 'k'], [1, 'eShort'], [2, 't'], [4, 'l']],
    spoken: kettleWord,
  }, {
    word: 'spoon',
    sounds: [[0, 's'], [1, 'p'], [2, 'uLongBlue'], [4, 'n']],
    spoken: spoonWord,
  }, {
    word: 'fork',
    sounds: [[0, 'f'], [1, 'oLongMore'], [2, 'r'], [3, 'k']],
    spoken: forkWord,
  }, {
    word: 'plate',
    sounds: [[0, 'p'], [1, 'l'], [2, 'aLong'], [3, 't']],
    spoken: plateWord,
  }, {
    word: 'bowl',
    sounds: [[0, 'b'], [1, 'oLongGo'], [2, 'w'], [3, 'l']],
    spoken: bowlWord,
  }],
});

