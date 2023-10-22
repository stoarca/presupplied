import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import gapWord from './gap.wav';
import gaspWord from './gasp.wav';
import golfWord from './golf.wav';
import gripWord from './grip.wav';
import getWord from './get.wav';
import gumWord from './gum.wav';
import gasWord from './gas.wav';
import logWord from './log.wav';
import bagWord from './bag.wav';
import hugWord from './hug.wav';
import bugWord from './bug.wav';

export default ModuleBuilder({
  variants: [{
    word: 'gap',
    sounds: [[0, 'gHard'], [1, 'aShortAt'], [2, 'p']],
    spoken: gapWord,
  }, {
    word: 'gasp',
    sounds: [[0, 'gHard'], [1, 'aShortAt'], [2, 's'], [3, 'p']],
    spoken: gaspWord,
  }, {
    word: 'golf',
    sounds: [[0, 'gHard'], [1, 'oShortMom'], [2, 'l'], [3, 'f']],
    spoken: golfWord,
  }, {
    word: 'grip',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'iShort'], [3, 'p']],
    spoken: gripWord,
  }, {
    word: 'get',
    sounds: [[0, 'gHard'], [1, 'eShort'], [2, 't']],
    spoken: getWord,
  }, {
    word: 'gum',
    sounds: [[0, 'gHard'], [1, 'uShortDuck'], [2, 'm']],
    spoken: gumWord,
  }, {
    word: 'gas',
    sounds: [[0, 'gHard'], [1, 'aShortAt'], [2, 's']],
    spoken: gasWord,
  }, {
    word: 'log',
    sounds: [[0, 'l'], [1, 'oShortMom'], [2, 'gHard']],
    spoken: logWord,
  }, {
    word: 'bag',
    sounds: [[0, 'b'], [1, 'aShortAnd'], [2, 'gHard']],
    spoken: bagWord,
  }, {
    word: 'hug',
    sounds: [[0, 'h'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: hugWord,
  }, {
    word: 'bug',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: bugWord,
  }],
});
