import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import fishWord from './fish.wav';
import walrusWord from './walrus.wav';
import sealWord from './seal.wav';
import whaleWord from './whale.wav';
import starfishWord from './starfish.wav';
import jellyfishWord from './jellyfish.wav';
import dolphinWord from './dolphin.wav';
import sharkWord from './shark.wav';
import otterWord from './otter.wav';
import crabWord from './crab.wav';
import penguinWord from './penguin.wav';
import seahorseWord from './seahorse.wav';

export default ModuleBuilder({
  variants: [{
    word: 'fish',
    sounds: [[0, 'f'], [1, 'iShort'], [2, 'sh']],
    spoken: fishWord,
  }, {
    word: 'walrus',
    sounds: [[0, 'w'], [1, 'aShortAre'], [2, 'l'], [3, 'r'], [4, 'schwa'], [5, 's']],
    spoken: walrusWord,
  }, {
    word: 'seal',
    sounds: [[0, 's'], [1, 'eLong'], [3, 'l']],
    spoken: sealWord,
  }, {
    word: 'whale',
    sounds: [[0, 'w'], [2, 'aLong'], [3, 'l']],
    spoken: whaleWord,
  }, {
    word: 'starfish',
    sounds: [[0, 's'], [1, 't'], [2, 'aShortAre'], [3, 'r'], [4, 'f'], [5, 'iShort'], [6, 'sh']],
    spoken: starfishWord,
  }, {
    word: 'jellyfish',
    sounds: [[0, 'j'], [1, 'eShort'], [2, 'l'], [4, 'eLong'], [5, 'f'], [6, 'iShort'], [7, 'sh']],
    spoken: jellyfishWord,
  }, {
    word: 'dolphin',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'l'], [3, 'f'], [5, 'iShort'], [6, 'n']],
    spoken: dolphinWord,
  }, {
    word: 'shark',
    sounds: [[0, 'sh'], [2, 'aShortAre'], [3, 'r'], [4, 'k']],
    spoken: sharkWord,
  }, {
    word: 'otter',
    sounds: [[0, 'oShortMom'], [1, 't'], [3, 'schwa'], [4, 'r']],
    spoken: otterWord,
  }, {
    word: 'crab',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aShortAt'], [3, 'b']],
    spoken: crabWord,
  }, {
    word: 'penguin',
    sounds: [[0, 'p'], [1, 'eShort'], [2, 'n'], [3, 'gHard'], [4, 'w'], [5, 'iShort'], [6, 'n']],
    spoken: penguinWord,
  }, {
    word: 'seahorse',
    sounds: [[0, 's'], [1, 'eLong'], [3, 'h'], [4, 'oLongMore'], [5, 'r'], [6, 's']],
    spoken: seahorseWord,
  }],
});

