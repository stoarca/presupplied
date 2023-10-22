import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import backWord from './back.wav';
import packWord from './pack.wav';
import kickWord from './kick.wav';
import lickWord from './lick.wav';
import ickyWord from './icky.wav';
import sockWord from './sock.wav';
import stickWord from './stick.wav';
import rockWord from './rock.wav';
import pocketWord from './pocket.wav';
import pickleWord from './pickle.wav';
import luckyWord from './lucky.wav';

export default ModuleBuilder({
  variants: [{
    word: 'back',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'k']],
    spoken: backWord,
  }, {
    word: 'pack',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 'k']],
    spoken: packWord,
  }, {
    word: 'kick',
    sounds: [[0, 'k'], [1, 'iShort'], [2, 'k']],
    spoken: kickWord,
  }, {
    word: 'lick',
    sounds: [[0, 'l'], [1, 'iShort'], [2, 'k']],
    spoken: lickWord,
  }, {
    word: 'icky',
    sounds: [[0, 'iShort'], [1, 'k'], [3, 'eLong']],
    spoken: ickyWord,
  }, {
    word: 'sock',
    sounds: [[0, 's'], [1, 'oShortMom'], [2, 'k']],
    spoken: sockWord,
  }, {
    word: 'stick',
    sounds: [[0, 's'], [1, 't'], [2, 'iShort'], [3, 'k']],
    spoken: stickWord,
  }, {
    word: 'rock',
    sounds: [[0, 'r'], [1, 'oShortMom'], [2, 'k']],
    spoken: rockWord,
  }, {
    word: 'pocket',
    sounds: [[0, 'p'], [1, 'oShortMom'], [2, 'k'], [4, 'eShort'], [5, 't']],
    spoken: pocketWord,
  }, {
    word: 'pickle',
    sounds: [[0, 'p'], [1, 'iShort'], [2, 'k'], [4, 'l']],
    spoken: pickleWord,
  }, {
    word: 'lucky',
    sounds: [[0, 'l'], [1, 'uShortDuck'], [2, 'k'], [4, 'eLong']],
    spoken: luckyWord,
  }],
});
