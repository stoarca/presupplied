import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import thisWord from './this.wav';
import thatWord from './that.wav';
import thoseWord from './those.wav';
import theseWord from './these.wav';
import brotherWord from './brother.wav';
import motherWord from './mother.wav';
import otherWord from './other.wav';
import anotherWord from './another.wav';
import thereWord from './there.wav';
import theirWord from './their.wav';
import theyWord from './they.wav';
import thenWord from './then.wav';

export default ModuleBuilder({
  variants: [{
    word: 'this',
    sounds: [[0, 'thThis'], [2, 'iShort'], [3, 's']],
    spoken: thisWord,
  }, {
    word: 'that',
    sounds: [[0, 'thThis'], [2, 'aShortAt'], [3, 't']],
    spoken: thatWord,
  }, {
    word: 'those',
    sounds: [[0, 'thThis'], [2, 'oLongGo'], [3, 'z']],
    spoken: thoseWord,
  }, {
    word: 'these',
    sounds: [[0, 'thThis'], [2, 'eLong'], [4, 'z']],
    spoken: theseWord,
  }, {
    word: 'brother',
    sounds: [[0, 'b'], [1, 'r'], [2, 'schwa'], [3, 'thThis'], [5, 'eShort'], [6, 'r']],
    spoken: brotherWord,
  }, {
    word: 'mother',
    sounds: [[0, 'm'], [1, 'schwa'], [2, 'thThis'], [4, 'eShort'], [5, 'r']],
    spoken: motherWord,
  }, {
    word: 'other',
    sounds: [[0, 'schwa'], [1, 'thThis'], [3, 'eShort'], [4, 'r']],
    spoken: otherWord,
  }, {
    word: 'another',
    sounds: [[0, 'schwa'], [1, 'n'], [2, 'schwa'], [3, 'thThis'], [5, 'eShort'], [6, 'r']],
    spoken: anotherWord,
  }, {
    word: 'there',
    sounds: [[0, 'thThis'], [2, 'eShort'], [3, 'r']],
    spoken: thereWord,
  }, {
    word: 'their',
    sounds: [[0, 'thThis'], [2, 'eShort'], [4, 'r']],
    spoken: theirWord,
  }, {
    word: 'they',
    sounds: [[0, 'thThis'], [2, 'aLong']],
    spoken: theyWord,
  }, {
    word: 'then',
    sounds: [[0, 'thThis'], [2, 'eShort'], [3, 'n']],
    spoken: thenWord,
  }],
});

