import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import driveWord from './drive.wav';
import drinkWord from './drink.wav';
import bedroomWord from './bedroom.wav';
import drawWord from './draw.wav';
import dreamWord from './dream.wav';
import dropWord from './drop.wav';
import drumWord from './drum.wav';
import dressWord from './dress.wav';
import addressWord from './address.wav';
import screwdriverWord from './screwdriver.wav';
import dragonWord from './dragon.wav';

export default ModuleBuilder({
  variants: [{
    word: 'drive',
    sounds: [[0, 'd'], [1, 'r'], [2, 'iLong'], [3, 'v']],
    spoken: driveWord,
  }, {
    word: 'drink',
    sounds: [[0, 'd'], [1, 'r'], [2, 'iShort'], [3, 'n'], [4, 'k']],
    spoken: drinkWord,
  }, {
    word: 'bedroom',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'd'], [3, 'r'], [4, 'uLongBlue'], [6, 'm']],
    spoken: bedroomWord,
  }, {
    word: 'draw',
    sounds: [[0, 'd'], [1, 'r'], [2, 'aShortAre']],
    spoken: drawWord,
  }, {
    word: 'dream',
    sounds: [[0, 'd'], [1, 'r'], [2, 'eLong'], [4, 'm']],
    spoken: dreamWord,
  }, {
    word: 'drop',
    sounds: [[0, 'd'], [1, 'r'], [2, 'oShortMom'], [3, 'p']],
    spoken: dropWord,
  }, {
    word: 'drum',
    sounds: [[0, 'd'], [1, 'r'], [2, 'uShortDuck'], [3, 'm']],
    spoken: drumWord,
  }, {
    word: 'dress',
    sounds: [[0, 'd'], [1, 'r'], [2, 'eShort'], [3, 's']],
    spoken: dressWord,
  }, {
    word: 'address',
    sounds: [[0, 'aShortAt'], [1, 'd'], [3, 'r'], [4, 'eShort'], [5, 's']],
    spoken: addressWord,
  }, {
    word: 'screwdriver',
    sounds: [[0, 's'], [1, 'k'], [2, 'r'], [3, 'uLongBlue'], [5, 'd'], [6, 'r'], [7, 'iLong'], [8, 'v'], [9, 'eShort'], [10, 'r']],
    spoken: screwdriverWord,
  }, {
    word: 'dragon',
    sounds: [[0, 'd'], [1, 'r'], [2, 'aShortAt'], [3, 'gHard'], [4, 'schwa'], [5, 'n']],
    spoken: dragonWord,
  }],
});

