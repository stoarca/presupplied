import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import flowersWord from './flowers.wav';
import gardenWord from './garden.wav';
import bushesWord from './bushes.wav';
import roseWord from './rose.wav';
import birdfeederWord from './birdfeeder.wav';
import backyardWord from './backyard.wav';
import treesWord from './trees.wav';
import patioWord from './patio.wav';
import soilWord from './soil.wav';
import flowerbedWord from './flowerbed.wav';
import plantsWord from './plants.wav';
import grassWord from './grass.wav';

export default ModuleBuilder({
  variants: [{
    word: 'flowers',
    sounds: [[0, 'f'], [1, 'l'], [2, 'oShortOut'], [3, 'w'], [4, 'schwa'], [5, 'r'], [6, 'z']],
    spoken: flowersWord,
  }, {
    word: 'garden',
    sounds: [[0, 'gHard'], [1, 'aShortAre'], [2, 'r'], [3, 'd'], [4, 'schwa'], [5, 'n']],
    spoken: gardenWord,
  }, {
    word: 'bushes',
    sounds: [[0, 'b'], [1, 'uShortFull'], [2, 'sh'], [4, 'schwa'], [5, 'z']],
    spoken: bushesWord,
  }, {
    word: 'rose',
    sounds: [[0, 'r'], [1, 'oLongGo'], [2, 'z']],
    spoken: roseWord,
  }, {
    word: 'birdfeeder',
    sounds: [[0, 'b'], [1, 'schwa'], [2, 'r'], [3, 'd'], [4, 'f'], [5, 'eLong'], [7, 'd'], [8, 'schwa'], [9, 'r']],
    spoken: birdfeederWord,
  }, {
    word: 'backyard',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'k'], [4, 'yConsonant'], [5, 'aShortAre'], [6, 'r'], [7, 'd']],
    spoken: backyardWord,
  }, {
    word: 'trees',
    sounds: [[0, 't'], [1, 'r'], [2, 'eLong'], [4, 'z']],
    spoken: treesWord,
  }, {
    word: 'patio',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 't'], [3, 'eLong'], [4, 'oLongGo']],
    spoken: patioWord,
  }, {
    word: 'soil',
    sounds: [[0, 's'], [1, 'oLongMore'], [2, 'iShort'], [3, 'l']],
    spoken: soilWord,
  }, {
    word: 'flowerbed',
    sounds: [[0, 'f'], [1, 'l'], [2, 'oShortOut'], [3, 'w'], [4, 'schwa'], [5, 'r'], [6, 'b'], [7, 'eShort'], [8, 'd']],
    spoken: flowerbedWord,
  }, {
    word: 'plants',
    sounds: [[0, 'p'], [1, 'l'], [2, 'aShortAnd'], [3, 'n'], [4, 't'], [5, 's']],
    spoken: plantsWord,
  }, {
    word: 'grass',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAt'], [3, 's']],
    spoken: grassWord,
  }],
});

