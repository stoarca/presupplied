import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import appleWord from './apple.wav';
import bananaWord from './banana.wav';
import peachWord from './peach.wav';
import plumWord from './plum.wav';
import avocadoWord from './avocado.wav';
import tangerineWord from './tangerine.wav';
import orangeWord from './orange.wav';
import watermelonWord from './watermelon.wav';
import grapesWord from './grapes.wav';
import blueberriesWord from './blueberries.wav';
import pearWord from './pear.wav';

export default ModuleBuilder({
  variants: [{
    word: 'apple',
    sounds: [[0, 'aShortAt'], [1, 'p'], [2, 'l']],
    spoken: appleWord,
  }, {
    word: 'banana',
    sounds: [[0, 'b'], [1, 'aShortAnd'], [2, 'n'], [3, 'aShortAnd'], [4, 'n'], [5, 'aShortAnd']],
    spoken: bananaWord,
  }, {
    word: 'peach',
    sounds: [[0, 'p'], [1, 'eLong'], [3, 'ch']],
    spoken: peachWord,
  }, {
    word: 'plum',
    sounds: [[0, 'p'], [1, 'l'], [2, 'uShortDuck'], [3, 'm']],
    spoken: plumWord,
  }, {
    word: 'avocado',
    sounds: [[0, 'aShortAre'], [1, 'v'], [2, 'schwa'], [3, 'k'], [4, 'aShortAre'], [5, 'd'], [6, 'oLongGo']],
    spoken: avocadoWord,
  }, {
    word: 'tangerine',
    sounds: [[0, 't'], [1, 'aShortAnd'], [2, 'n'], [3, 'j'], [4, 'eLong'], [5, 'r'], [6, 'eLong'], [7, 'n']],
    spoken: tangerineWord,
  }, {
    word: 'orange',
    sounds: [[0, 'oLongMore'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [4, 'j']],
    spoken: orangeWord,
  }, {
    word: 'watermelon',
    sounds: [[0, 'w'], [1, 'aShortAre'], [2, 't'], [3, 'schwa'], [4, 'r'], [5, 'm'], [6, 'eShort'], [7, 'l'], [8, 'schwa'], [9, 'n']],
    spoken: watermelonWord,
  }, {
    word: 'grapes',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aLong'], [3, 'p'], [5, 's']],
    spoken: grapesWord,
  }, {
    word: 'blueberries',
    sounds: [[0, 'b'], [1, 'l'], [2, 'uLongBlue'], [4, 'b'], [5, 'eShort'], [6, 'r'], [8, 'eLong'], [10, 'z']],
    spoken: blueberriesWord,
  }, {
    word: 'pear',
    sounds: [[0, 'p'], [1, 'eLong'], [3, 'r']],
    spoken: pearWord,
  }],
});

