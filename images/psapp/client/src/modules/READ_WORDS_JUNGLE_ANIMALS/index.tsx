import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tigerWord from './tiger.wav';
import gorillaWord from './gorilla.wav';
import elephantWord from './elephant.wav';
import lionWord from './lion.wav';
import toucanWord from './toucan.wav';
import hippoWord from './hippo.wav';
import slothWord from './sloth.wav';
import crocodileWord from './crocodile.wav';
import rhinocerosWord from './rhinoceros.wav';
import chimpanzeeWord from './chimpanzee.wav';

export default ModuleBuilder({
  variants: [{
    word: 'tiger',
    sounds: [[0, 't'], [1, 'iLong'], [2, 'gHard'], [3, 'schwa'], [4, 'r']],
    spoken: tigerWord,
  }, {
    word: 'gorilla',
    sounds: [[0, 'gHard'], [1, 'schwa'], [2, 'r'], [3, 'iShort'], [4, 'l'], [5, 'schwa']],
    spoken: gorillaWord,
  }, {
    word: 'elephant',
    sounds: [[0, 'eShort'], [1, 'l'], [2, 'eShort'], [3, 'f'], [5, 'schwa'], [6, 'n'], [7, 't']],
    spoken: elephantWord,
  }, {
    word: 'lion',
    sounds: [[0, 'l'], [1, 'iLong'], [2, 'schwa'], [3, 'n']],
    spoken: lionWord,
  }, {
    word: 'toucan',
    sounds: [[0, 't'], [1, 'uLongBlue'], [3, 'k'], [4, 'aShortAnd'], [5, 'n']],
    spoken: toucanWord,
  }, {
    word: 'hippo',
    sounds: [[0, 'h'], [1, 'iShort'], [2, 'p'], [4, 'oLongGo']],
    spoken: hippoWord,
  }, {
    word: 'sloth',
    sounds: [[0, 's'], [1, 'l'], [2, 'oShortMom'], [3, 'thThink']],
    spoken: slothWord,
  }, {
    word: 'crocodile',
    sounds: [[0, 'k'], [1, 'r'], [2, 'oShortMom'], [3, 'k'], [4, 'schwa'], [5, 'd'], [6, 'iLong'], [7, 'l']],
    spoken: crocodileWord,
  }, {
    word: 'rhinoceros',
    sounds: [[0, 'r'], [2, 'iLong'], [3, 'n'], [4, 'aShortAre'], [5, 's'], [6, 'schwa'], [7, 'r'], [8, 'schwa'], [9, 's']],
    spoken: rhinocerosWord,
  }, {
    word: 'chimpanzee',
    sounds: [[0, 'ch'], [2, 'iShort'], [3, 'm'], [4, 'p'], [5, 'aShortAnd'], [6, 'n'], [7, 'z'], [8, 'eLong']],
    spoken: chimpanzeeWord,
  }],
});

