import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import alphabetWord from './alphabet.wav';
import elephantWord from './elephant.wav';
import pharmacyWord from './pharmacy.wav';
import phoneWord from './phone.wav';
import photographWord from './photograph.wav';
import photosWord from './photos.wav';
import sphereWord from './sphere.wav';
import microphoneWord from './microphone.wav';
import dolphinWord from './dolphin.wav';

export default ModuleBuilder({
  variants: [{
    word: 'alphabet',
    sounds: [[0, 'aShortAt'], [2, 'l'], [3, 'f'], [5, 'aShortAt'], [6, 'b'], [7, 'eShort'], [8, 't']],
    spoken: alphabetWord,
  }, {
    word: 'elephant',
    sounds: [[0, 'eShort'], [1, 'l'], [2, 'eShort'], [3, 'f'], [5, 'schwa'], [6, 'n'], [7, 't']],
    spoken: elephantWord,
  }, {
    word: 'pharmacy',
    sounds: [[0, 'f'], [2, 'aShortAre'], [3, 'r'], [4, 'm'], [5, 'schwa'], [6, 's'], [7, 'eLong']],
    spoken: pharmacyWord,
  }, {
    word: 'phone',
    sounds: [[0, 'f'], [1, 'oLongGo'], [3, 'n']],
    spoken: phoneWord,
  }, {
    word: 'photograph',
    sounds: [[0, 'f'], [2, 'oLongGo'], [3, 't'], [4, 'oLongGo'], [5, 'gHard'], [6, 'r'], [7, 'aShortAt'], [8, 'f']],
    spoken: photographWord,
  }, {
    word: 'photos',
    sounds: [[0, 'f'], [1, 'oLongGo'], [2, 't'], [3, 'oLongGo'], [4, 'z']],
    spoken: photosWord,
  }, {
    word: 'sphere',
    sounds: [[0, 's'], [1, 'f'], [3, 'eLong'], [4, 'r']],
    spoken: sphereWord,
  }, {
    word: 'microphone',
    sounds: [[0, 'm'], [1, 'iLong'], [2, 'k'], [3, 'r'], [4, 'schwa'], [5, 'f'], [7, 'oLongGo'], [8, 'n']],
    spoken: microphoneWord,
  }, {
    word: 'dolphin',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'l'], [3, 'f'], [5, 'iShort'], [6, 'n']],
    spoken: dolphinWord,
  }],
});

