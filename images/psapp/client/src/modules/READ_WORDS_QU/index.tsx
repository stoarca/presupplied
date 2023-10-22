import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import equalWord from './equal.wav';
import quackWord from './quack.wav';
import quarterWord from './quarter.wav';
import queenWord from './queen.wav';
import quickWord from './quick.wav';
import quietWord from './quiet.wav';
import quiteWord from './quite.wav';
import quitWord from './quit.wav';
import squashWord from './squash.wav';
import squeakWord from './squeak.wav';
import squirtWord from './squirt.wav';
import squishWord from './squish.wav';

export default ModuleBuilder({
  variants: [{
    word: 'equal',
    sounds: [[0, 'eLong'], [1, 'q'], [3, 'aShortAnd'], [4, 'l']],
    spoken: equalWord,
  }, {
    word: 'quack',
    sounds: [[0, 'q'], [2, 'aShortAt'], [3, 'k']],
    spoken: quackWord,
  }, {
    word: 'quarter',
    sounds: [[0, 'k'], [1, 'oLongMore'], [3, 'r'], [4, 't'], [5, 'eShort'], [6, 'r']],
    spoken: quarterWord,
  }, {
    word: 'queen',
    sounds: [[0, 'q'], [2, 'eLong'], [4, 'n']],
    spoken: queenWord,
  }, {
    word: 'quick',
    sounds: [[0, 'q'], [2, 'iShort'], [3, 'k']],
    spoken: quickWord,
  }, {
    word: 'quiet',
    sounds: [[0, 'q'], [2, 'iLong'], [3, 'eShort'], [4, 't']],
    spoken: quietWord,
  }, {
    word: 'quite',
    sounds: [[0, 'q'], [2, 'iLong'], [3, 't']],
    spoken: quiteWord,
  }, {
    word: 'quit',
    sounds: [[0, 'q'], [2, 'iShort'], [3, 't']],
    spoken: quitWord,
  }, {
    word: 'squash',
    sounds: [[0, 's'], [1, 'q'], [3, 'aShortAre'], [4, 'sh']],
    spoken: squashWord,
  }, {
    word: 'squeak',
    sounds: [[0, 's'], [1, 'q'], [3, 'eLong'], [5, 'k']],
    spoken: squeakWord,
  }, {
    word: 'squirt',
    sounds: [[0, 's'], [1, 'q'], [3, 'schwa'], [4, 'r'], [5, 't']],
    spoken: squirtWord,
  }, {
    word: 'squish',
    sounds: [[0, 's'], [1, 'q'], [3, 'iShort'], [4, 'sh']],
    spoken: squishWord,
  }],
});

