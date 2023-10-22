import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import toysWord from './toys.wav';
import dollWord from './doll.wav';
import superheroWord from './superhero.wav';
import crayonsWord from './crayons.wav';
import robotWord from './robot.wav';
import scooterWord from './scooter.wav';
import tricycleWord from './tricycle.wav';
import bicycleWord from './bicycle.wav';
import skateboardWord from './skateboard.wav';
import jigsawWord from './jigsaw.wav';
import blocksWord from './blocks.wav';

export default ModuleBuilder({
  variants: [{
    word: 'toys',
    sounds: [[0, 't'], [1, 'oLongMore'], [2, 'iShort'], [3, 'z']],
    spoken: toysWord,
  }, {
    word: 'doll',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'l']],
    spoken: dollWord,
  }, {
    word: 'superhero',
    sounds: [[0, 's'], [1, 'uLongBlue'], [2, 'p'], [3, 'schwa'], [4, 'r'], [5, 'h'], [6, 'eLong'], [7, 'r'], [8, 'oLongGo']],
    spoken: superheroWord,
  }, {
    word: 'crayons',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aLong'], [4, 'oShortMom'], [5, 'n'], [6, 'z']],
    spoken: crayonsWord,
  }, {
    word: 'robot',
    sounds: [[0, 'r'], [1, 'oLongGo'], [2, 'b'], [3, 'oShortMom'], [4, 't']],
    spoken: robotWord,
  }, {
    word: 'scooter',
    sounds: [[0, 's'], [1, 'k'], [2, 'uLongBlue'], [4, 't'], [5, 'schwa'], [6, 'r']],
    spoken: scooterWord,
  }, {
    word: 'tricycle',
    sounds: [[0, 't'], [1, 'r'], [2, 'iLong'], [3, 's'], [4, 'iShort'], [5, 'k'], [6, 'l']],
    spoken: tricycleWord,
  }, {
    word: 'bicycle',
    sounds: [[0, 'b'], [1, 'iLong'], [2, 's'], [3, 'iShort'], [4, 'k'], [5, 'l']],
    spoken: bicycleWord,
  }, {
    word: 'skateboard',
    sounds: [[0, 's'], [1, 'k'], [2, 'aLong'], [3, 't'], [5, 'b'], [6, 'oLongMore'], [7, 'r'], [8, 'd']],
    spoken: skateboardWord,
  }, {
    word: 'jigsaw',
    sounds: [[0, 'j'], [1, 'iShort'], [2, 'gHard'], [3, 's'], [4, 'aShortAre']],
    spoken: jigsawWord,
  }, {
    word: 'blocks',
    sounds: [[0, 'b'], [1, 'l'], [2, 'oShortMom'], [3, 'k'], [5, 's']],
    spoken: blocksWord,
  }],
});
