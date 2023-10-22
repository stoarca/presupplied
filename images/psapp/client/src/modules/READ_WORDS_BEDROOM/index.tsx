import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import bedroomWord from './bedroom.wav';
import blanketWord from './blanket.wav';
import closetWord from './closet.wav';
import cribWord from './crib.wav';
import drawerWord from './drawer.wav';
import dresserWord from './dresser.wav';
import pillowWord from './pillow.wav';
import lampWord from './lamp.wav';
import curtainWord from './curtain.wav';
import chairWord from './chair.wav';
import deskWord from './desk.wav';

export default ModuleBuilder({
  variants: [{
    word: 'bedroom',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'd'], [3, 'r'], [4, 'uLongBlue'], [6, 'm']],
    spoken: bedroomWord,
  }, {
    word: 'blanket',
    sounds: [[0, 'b'], [1, 'l'], [2, 'aShortAnd'], [3, 'n'], [4, 'k'], [5, 'eShort'], [6, 't']],
    spoken: blanketWord,
  }, {
    word: 'closet',
    sounds: [[0, 'k'], [1, 'l'], [2, 'oShortMom'], [3, 'z'], [4, 'eShort'], [5, 't']],
    spoken: closetWord,
  }, {
    word: 'crib',
    sounds: [[0, 'k'], [1, 'r'], [2, 'iShort'], [3, 'b']],
    spoken: cribWord,
  }, {
    word: 'drawer',
    sounds: [[0, 'd'], [1, 'r'], [2, 'oLongMore'], [5, 'r']],
    spoken: drawerWord,
  }, {
    word: 'dresser',
    sounds: [[0, 'd'], [1, 'r'], [2, 'eShort'], [3, 's'], [5, 'eShort'], [6, 'r']],
    spoken: dresserWord,
  }, {
    word: 'pillow',
    sounds: [[0, 'p'], [1, 'iShort'], [2, 'l'], [4, 'oLongGo']],
    spoken: pillowWord,
  }, {
    word: 'lamp',
    sounds: [[0, 'l'], [1, 'aShortAnd'], [2, 'm'], [3, 'p']],
    spoken: lampWord,
  }, {
    word: 'curtain',
    sounds: [[0, 'k'], [1, 'schwa'], [2, 'r'], [3, 't'], [4, 'schwa'], [5, 'n']],
    spoken: curtainWord,
  }, {
    word: 'chair',
    sounds: [[0, 'ch'], [1, 'aShortAnd'], [2, 'r']],
    spoken: chairWord,
  }, {
    word: 'desk',
    sounds: [[0, 'd'], [1, 'eShort'], [2, 's'], [3, 'k']],
    spoken: deskWord,
  }],
});

