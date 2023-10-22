import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tomatoWord from './tomato.wav';
import cucumberWord from './cucumber.wav';
import eggplantWord from './eggplant.wav';
import zucchiniWord from './zucchini.wav';
import pepperWord from './pepper.wav';
import asparagusWord from './asparagus.wav';
import onionWord from './onion.wav';
import garlicWord from './garlic.wav';
import cabbageWord from './cabbage.wav';
import cauliflowerWord from './cauliflower.wav';
import carrotWord from './carrot.wav';

export default ModuleBuilder({
  variants: [{
    word: 'tomato',
    sounds: [[0, 't'], [1, 'schwa'], [2, 'm'], [3, 'aLong'], [4, 't'], [5, 'oLongGo']],
    spoken: tomatoWord,
  }, {
    word: 'cucumber',
    sounds: [[0, 'k'], [1, 'uLongMute'], [2, 'k'], [4, 'uShortDuck'], [5, 'm'], [6, 'b'], [7, 'schwa'], [8, 'r']],
    spoken: cucumberWord,
  }, {
    word: 'eggplant',
    sounds: [[0, 'eShort'], [1, 'gHard'], [3, 'p'], [4, 'l'], [5, 'aShortAnd'], [6, 'n'], [7, 't']],
    spoken: eggplantWord,
  }, {
    word: 'zucchini',
    sounds: [[0, 'z'], [1, 'uLongBlue'], [2, 'k'], [5, 'eLong'], [6, 'n'], [7, 'eLong']],
    spoken: zucchiniWord,
  }, {
    word: 'pepper',
    sounds: [[0, 'p'], [1, 'eShort'], [2, 'p'], [4, 'schwa'], [5, 'r']],
    spoken: pepperWord,
  }, {
    word: 'asparagus',
    sounds: [[0, 'schwa'], [1, 's'], [2, 'p'], [3, 'aShortAnd'], [4, 'r'], [5, 'schwa'], [6, 'gHard'], [7, 'schwa'], [8, 's']],
    spoken: asparagusWord,
  }, {
    word: 'onion',
    sounds: [[0, 'schwa'], [1, 'n'], [2, 'yConsonant'], [3, 'schwa'], [4, 'n']],
    spoken: onionWord,
  }, {
    word: 'garlic',
    sounds: [[0, 'gHard'], [1, 'aShortAre'], [2, 'r'], [3, 'l'], [4, 'iShort'], [5, 'k']],
    spoken: garlicWord,
  }, {
    word: 'cabbage',
    sounds: [[0, 'k'], [1, 'aShortAt'], [2, 'b'], [4, 'schwa'], [5, 'j']],
    spoken: cabbageWord,
  }, {
    word: 'cauliflower',
    sounds: [[0, 'k'], [1, 'aShortAre'], [2, 'l'], [3, 'eLong'], [4, 'f'], [5, 'l'], [6, 'oShortOut'], [7, 'w'], [8, 'schwa'], [9, 'r']],
    spoken: cauliflowerWord,
  }, {
    word: 'carrot',
    sounds: [[0, 'k'], [1, 'aShortAnd'], [2, 'r'], [4, 'schwa'], [4, 't']],
    spoken: carrotWord,
  }],
});

