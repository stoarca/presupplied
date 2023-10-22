import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import happyWord from './happy.wav';
import sadWord from './sad.wav';
import angryWord from './angry.wav';
import jealousWord from './jealous.wav';
import proudWord from './proud.wav';
import excitedWord from './excited.wav';
import lonelyWord from './lonely.wav';
import nervousWord from './nervous.wav';
import scaredWord from './scared.wav';
import calmWord from './calm.wav';
import boredWord from './bored.wav';

export default ModuleBuilder({
  variants: [{
    word: 'happy',
    sounds: [[0, 'h'], [1, 'aShortAt'], [2, 'p'], [4, 'eLong']],
    spoken: happyWord,
  }, {
    word: 'sad',
    sounds: [[0, 's'], [1, 'aShortAt'], [2, 'd']],
    spoken: sadWord,
  }, {
    word: 'angry',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'gHard'], [3, 'r'], [4, 'eLong']],
    spoken: angryWord,
  }, {
    word: 'jealous',
    sounds: [[0, 'j'], [1, 'eLong'], [3, 'l'], [4, 'uShortDuck'], [6, 's']],
    spoken: jealousWord,
  }, {
    word: 'proud',
    sounds: [[0, 'p'], [1, 'r'], [2, 'oShortOut'], [3, 'uShortFull'], [4, 'd']],
    spoken: proudWord,
  }, {
    word: 'excited',
    sounds: [[0, 'eLong'], [1, 'x'], [2, 's'], [3, 'iLong'], [4, 't'], [5, 'eShort'], [6, 'd']],
    spoken: excitedWord,
  }, {
    word: 'lonely',
    sounds: [[0, 'l'], [1, 'oLongGo'], [2, 'n'], [4, 'l'], [5, 'eLong']],
    spoken: lonelyWord,
  }, {
    word: 'nervous',
    sounds: [[0, 'n'], [1, 'eShort'], [2, 'r'], [3, 'v'], [4, 'uShortDuck'], [6, 's']],
    spoken: nervousWord,
  }, {
    word: 'scared',
    sounds: [[0, 's'], [1, 'k'], [2, 'aShortAnd'], [3, 'r'], [5, 'd']],
    spoken: scaredWord,
  }, {
    word: 'calm',
    sounds: [[0, 'k'], [1, 'aShortAre'], [2, 'l'], [3, 'm']],
    spoken: calmWord,
  }, {
    word: 'bored',
    sounds: [[0, 'b'], [1, 'oLongMore'], [2, 'r'], [4, 'd']],
    spoken: boredWord,
  }],
});

