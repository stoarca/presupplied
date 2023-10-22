import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import potWord from './pot.wav';
import dogWord from './dog.wav';
import hotWord from './hot.wav';
import topWord from './top.wav';
import boxWord from './box.wav';
import mopWord from './mop.wav';
import hopWord from './hop.wav';
import someWord from './some.wav';
import lotWord from './lot.wav';
import dotWord from './dot.wav';
import fogWord from './fog.wav';
import jobWord from './job.wav';
import popWord from './pop.wav';

export default ModuleBuilder({
  variants: [{
    word: 'pot',
    sounds: [[0, 'p'], [1, 'oShortMom'], [2, 't']],
    spoken: potWord,
  }, {
    word: 'dog',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'gHard']],
    spoken: dogWord,
  }, {
    word: 'hot',
    sounds: [[0, 'h'], [1, 'oShortMom'], [2, 't']],
    spoken: hotWord,
  }, {
    word: 'top',
    sounds: [[0, 't'], [1, 'oShortMom'], [2, 'p']],
    spoken: topWord,
  }, {
    word: 'box',
    sounds: [[0, 'b'], [1, 'oShortMom'], [2, 'x']],
    spoken: boxWord,
  }, {
    word: 'mop',
    sounds: [[0, 'm'], [1, 'oShortMom'], [2, 'p']],
    spoken: mopWord,
  }, {
    word: 'hop',
    sounds: [[0, 'h'], [1, 'oShortMom'], [2, 'p']],
    spoken: hopWord,
  }, {
    word: 'some',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'm']],
    spoken: someWord,
  }, {
    word: 'lot',
    sounds: [[0, 'l'], [1, 'oShortMom'], [2, 't']],
    spoken: lotWord,
  }, {
    word: 'dot',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 't']],
    spoken: dotWord,
  }, {
    word: 'fog',
    sounds: [[0, 'f'], [1, 'oShortMom'], [2, 'gHard']],
    spoken: fogWord,
  }, {
    word: 'job',
    sounds: [[0, 'j'], [1, 'oShortMom'], [2, 'b']],
    spoken: jobWord,
  }, {
    word: 'pop',
    sounds: [[0, 'p'], [1, 'oShortMom'], [2, 'p']],
    spoken: popWord,
  }],
});
