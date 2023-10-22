import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import antWord from './ant.wav';
import bugWord from './bug.wav';
import beetleWord from './beetle.wav';
import butterflyWord from './butterfly.wav';
import beeWord from './bee.wav';
import cockroachWord from './cockroach.wav';
import dragonflyWord from './dragonfly.wav';
import waspWord from './wasp.wav';
import caterpillarWord from './caterpillar.wav';
import ladybugWord from './ladybug.wav';
import mothWord from './moth.wav';
import cricketWord from './cricket.wav';
import grasshopperWord from './grasshopper.wav';

export default ModuleBuilder({
  variants: [{
    word: 'ant',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 't']],
    spoken: antWord,
  }, {
    word: 'bug',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: bugWord,
  }, {
    word: 'beetle',
    sounds: [[0, 'b'], [1, 'eLong'], [3, 't'], [4, 'l']],
    spoken: beetleWord,
  }, {
    word: 'butterfly',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 't'], [4, 'schwa'], [5, 'r'], [6, 'f'], [7, 'l'], [8, 'iLong']],
    spoken: butterflyWord,
  }, {
    word: 'bee',
    sounds: [[0, 'b'], [1, 'eLong']],
    spoken: beeWord,
  }, {
    word: 'cockroach',
    sounds: [[0, 'k'], [1, 'oShortMom'], [2, 'k'], [4, 'r'], [5, 'oLongGo'], [7, 'ch']],
    spoken: cockroachWord,
  }, {
    word: 'dragonfly',
    sounds: [[0, 'd'], [1, 'r'], [2, 'aShortAnd'], [3, 'gHard'], [4, 'schwa'], [5, 'n'], [6, 'f'], [7, 'l'], [8, 'iLong']],
    spoken: dragonflyWord,
  }, {
    word: 'wasp',
    sounds: [[0, 'w'], [1, 'aShortAre'], [2, 's'], [3, 'p']],
    spoken: waspWord,
  }, {
    word: 'caterpillar',
    sounds: [[0, 'k'], [1, 'aShortAt'], [2, 't'], [3, 'schwa'], [4, 'r'], [5, 'p'], [6, 'iShort'], [7, 'l'], [9, 'schwa'], [10, 'r']],
    spoken: caterpillarWord,
  }, {
    word: 'ladybug',
    sounds: [[0, 'l'], [1, 'aLong'], [2, 'd'], [3, 'eLong'], [4, 'b'], [5, 'uShortDuck'], [6, 'gHard']],
    spoken: ladybugWord,
  }, {
    word: 'moth',
    sounds: [[0, 'm'], [1, 'oShortMom'], [2, 'thThink']],
    spoken: mothWord,
  }, {
    word: 'cricket',
    sounds: [[0, 'k'], [1, 'r'], [2, 'iShort'], [3, 'k'], [5, 'iShort'], [6, 't']],
    spoken: cricketWord,
  }, {
    word: 'grasshopper',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAt'], [3, 's'], [5, 'h'], [6, 'oShortMom'], [7, 'p'], [9, 'schwa'], [10, 'r']],
    spoken: grasshopperWord,
  }],
});

