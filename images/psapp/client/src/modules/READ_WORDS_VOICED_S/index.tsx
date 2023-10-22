import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import useWord from './use.wav';
import loseWord from './lose.wav';
import kidsWord from './kids.wav';
import dogsWord from './dogs.wav';
import cansWord from './cans.wav';
import busesWord from './buses.wav';
import skisWord from './skis.wav';
import doesWord from './does.wav';
import goesWord from './goes.wav';
import potatoesWord from './potatoes.wav';
import chooseWord from './choose.wav';
import cheeseWord from './cheese.wav';
import pleaseWord from './please.wav';

export default ModuleBuilder({
  variants: [{
    word: 'use',
    sounds: [[0, 'uLongMute'], [1, 'z']],
    spoken: useWord,
  }, {
    word: 'lose',
    sounds: [[0, 'l'], [1, 'uLongBlue'], [2, 'z']],
    spoken: loseWord,
  }, {
    word: 'kids',
    sounds: [[0, 'k'], [1, 'iShort'], [2, 'd'], [3, 'z']],
    spoken: kidsWord,
  }, {
    word: 'dogs',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'gHard'], [3, 'z']],
    spoken: dogsWord,
  }, {
    word: 'cans',
    sounds: [[0, 'k'], [1, 'aShortAnd'], [2, 'n'], [3, 'z']],
    spoken: cansWord,
  }, {
    word: 'buses',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 's'], [3, 'eShort'], [4, 'z']],
    spoken: busesWord,
  }, {
    word: 'skis',
    sounds: [[0, 's'], [1, 'k'], [2, 'eLong'], [3, 'z']],
    spoken: skisWord,
  }, {
    word: 'does',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [3, 'z']],
    spoken: doesWord,
  }, {
    word: 'goes',
    sounds: [[0, 'gHard'], [1, 'oLongGo'], [3, 'z']],
    spoken: goesWord,
  }, {
    word: 'potatoes',
    sounds: [[0, 'p'], [1, 'schwa'], [2, 't'], [3, 'aLong'], [4, 't'], [5, 'oLongGo'], [7, 'z']],
    spoken: potatoesWord,
  }, {
    word: 'choose',
    sounds: [[0, 'ch'], [2, 'uLongBlue'], [4, 'z']],
    spoken: chooseWord,
  }, {
    word: 'cheese',
    sounds: [[0, 'ch'], [2, 'eLong'], [4, 'z']],
    spoken: cheeseWord,
  }, {
    word: 'please',
    sounds: [[0, 'p'], [1, 'l'], [2, 'eLong'], [4, 'z']],
    spoken: pleaseWord,
  }],
});

