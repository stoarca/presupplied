import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import momWord from './mom.wav';
import dadWord from './dad.wav';
import brotherWord from './brother.wav';
import sisterWord from './sister.wav';
import auntWord from './aunt.wav';
import uncleWord from './uncle.wav';
import cousinWord from './cousin.wav';
import sonWord from './son.wav';
import daughterWord from './daughter.wav';
import grandmotherWord from './grandmother.wav';
import grandfatherWord from './grandfather.wav';
import grandmaWord from './grandma.wav';
import grandpaWord from './grandpa.wav';

export default ModuleBuilder({
  variants: [{
    word: 'mom',
    sounds: [[0, 'm'], [1, 'oShortMom'], [2, 'm']],
    spoken: momWord,
  }, {
    word: 'dad',
    sounds: [[0, 'd'], [1, 'aShortAt'], [2, 'd']],
    spoken: dadWord,
  }, {
    word: 'brother',
    sounds: [[0, 'b'], [1, 'r'], [2, 'schwa'], [3, 'thThis'], [5, 'schwa'], [6, 'r']],
    spoken: brotherWord,
  }, {
    word: 'sister',
    sounds: [[0, 's'], [1, 'iShort'], [2, 's'], [3, 't'], [4, 'schwa'], [5, 'r']],
    spoken: sisterWord,
  }, {
    word: 'aunt',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 't']],
    spoken: auntWord,
  }, {
    word: 'uncle',
    sounds: [[0, 'uShortDuck'], [1, 'n'], [2, 'k'], [3, 'l']],
    spoken: uncleWord,
  }, {
    word: 'cousin',
    sounds: [[0, 'k'], [1, 'uShortDuck'], [3, 'z'], [4, 'iShort'], [5, 'n']],
    spoken: cousinWord,
  }, {
    word: 'son',
    sounds: [[0, 's'], [1, 'oShortMom'], [2, 'n']],
    spoken: sonWord,
  }, {
    word: 'daughter',
    sounds: [[0, 'd'], [1, 'aShortAre'], [3, 't'], [6, 'schwa'], [7, 'r']],
    spoken: daughterWord,
  }, {
    word: 'grandmother',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [4, 'd'], [5, 'm'], [6, 'schwa'], [7, 'thThis'], [9, 'schwa'], [10, 'r']],
    spoken: grandmotherWord,
  }, {
    word: 'grandfather',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [4, 'd'], [5, 'f'], [6, 'aShortAre'], [7, 'thThis'], [9, 'schwa'], [10, 'r']],
    spoken: grandfatherWord,
  }, {
    word: 'grandma',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [5, 'm'], [6, 'aShortAre']],
    spoken: grandmaWord,
  }, {
    word: 'grandpa',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [5, 'p'], [6, 'aShortAre']],
    spoken: grandpaWord,
  }],
});

