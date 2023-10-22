import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import showerWord from './shower.wav';
import toiletWord from './toilet.wav';
import mirrorWord from './mirror.wav';
import bathroomWord from './bathroom.wav';
import scaleWord from './scale.wav';
import brushWord from './brush.wav';
import towelWord from './towel.wav';
import faucetWord from './faucet.wav';
import bathtubWord from './bathtub.wav';
import flushWord from './flush.wav';
import robeWord from './robe.wav';

export default ModuleBuilder({
  variants: [{
    word: 'shower',
    sounds: [[0, 'sh'], [2, 'oShortOut'], [3, 'w'], [4, 'schwa'], [5, 'r']],
    spoken: showerWord,
  }, {
    word: 'toilet',
    sounds: [[0, 't'], [1, 'oLongMore'], [2, 'iShort'], [3, 'l'], [4, 'eShort'], [5, 't']],
    spoken: toiletWord,
  }, {
    word: 'mirror',
    sounds: [[0, 'm'], [1, 'iShort'], [2, 'r'], [4, 'schwa'], [5, 'r']],
    spoken: mirrorWord,
  }, {
    word: 'bathroom',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'thThink'], [4, 'r'], [5, 'uLongBlue'], [7, 'm']],
    spoken: bathroomWord,
  }, {
    word: 'scale',
    sounds: [[0, 's'], [1, 'k'], [2, 'aLong'], [4, 'l']],
    spoken: scaleWord,
  }, {
    word: 'brush',
    sounds: [[0, 'b'], [1, 'r'], [2, 'uShortDuck'], [3, 'sh']],
    spoken: brushWord,
  }, {
    word: 'towel',
    sounds: [[0, 't'], [1, 'oShortOut'], [2, 'w'], [3, 'eLong'], [4, 'l']],
    spoken: towelWord,
  }, {
    word: 'faucet',
    sounds: [[0, 'f'], [1, 'aShortAre'], [3, 's'], [3, 'eLong'], [4, 't']],
    spoken: faucetWord,
  }, {
    word: 'bathtub',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'thThink'], [4, 't'], [5, 'uShortDuck'], [6, 'b']],
    spoken: bathtubWord,
  }, {
    word: 'flush',
    sounds: [[0, 'f'], [1, 'l'], [2, 'uShortDuck'], [3, 'sh']],
    spoken: flushWord,
  }, {
    word: 'robe',
    sounds: [[0, 'r'], [1, 'oLongGo'], [2, 'b']],
    spoken: robeWord,
  }],
});

