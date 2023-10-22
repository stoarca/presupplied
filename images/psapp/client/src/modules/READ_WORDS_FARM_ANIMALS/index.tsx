import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import cowWord from './cow.wav';
import pigWord from './pig.wav';
import goatWord from './goat.wav';
import sheepWord from './sheep.wav';
import donkeyWord from './donkey.wav';
import chickenWord from './chicken.wav';
import poultryWord from './poultry.wav';
import turkeyWord from './turkey.wav';
import honeybeeWord from './honeybee.wav';
import gooseWord from './goose.wav';
import llamaWord from './llama.wav';

export default ModuleBuilder({
  variants: [{
    word: 'cow',
    sounds: [[0, 'k'], [1, 'oShortOut'], [2, 'w']],
    spoken: cowWord,
  }, {
    word: 'pig',
    sounds: [[0, 'p'], [1, 'iShort'], [2, 'gHard']],
    spoken: pigWord,
  }, {
    word: 'goat',
    sounds: [[0, 'gHard'], [1, 'oLongGo'], [3, 't']],
    spoken: goatWord,
  }, {
    word: 'sheep',
    sounds: [[0, 'sh'], [2, 'eLong'], [4, 'p']],
    spoken: sheepWord,
  }, {
    word: 'donkey',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'n'], [3, 'k'], [4, 'eLong']],
    spoken: donkeyWord,
  }, {
    word: 'chicken',
    sounds: [[0, 'ch'], [2, 'iShort'], [3, 'k'], [5, 'eShort'], [6, 'n']],
    spoken: chickenWord,
  }, {
    word: 'poultry',
    sounds: [[0, 'p'], [1, 'oLongMore'], [3, 'l'], [4, 't'], [5, 'r'], [6, 'eLong']],
    spoken: poultryWord,
  }, {
    word: 'turkey',
    sounds: [[0, 't'], [1, 'schwa'], [2, 'r'], [3, 'k'], [4, 'eLong']],
    spoken: turkeyWord,
  }, {
    word: 'honeybee',
    sounds: [[0, 'h'], [1, 'uShortDuck'], [2, 'n'], [3, 'eLong'], [5, 'b'], [6, 'eLong']],
    spoken: honeybeeWord,
  }, {
    word: 'goose',
    sounds: [[0, 'gHard'], [1, 'uLongBlue'], [3, 's']],
    spoken: gooseWord,
  }, {
    word: 'llama',
    sounds: [[0, 'l'], [2, 'aShortAre'], [3, 'm'], [4, 'schwa']],
    spoken: llamaWord,
  }],
});

