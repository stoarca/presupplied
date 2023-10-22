import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import archWord from './arch.wav';
import torchWord from './torch.wav';
import benchWord from './bench.wav';
import checkWord from './check.wav';
import chainWord from './chain.wav';
import branchWord from './branch.wav';
import bunchWord from './bunch.wav';
import chairWord from './chair.wav';
import chaseWord from './chase.wav';
import lunchWord from './lunch.wav';
import peachWord from './peach.wav';
import reachWord from './reach.wav';
import touchWord from './touch.wav';

export default ModuleBuilder({
  variants: [{
    word: 'arch',
    sounds: [[0, 'aLong'], [1, 'r'], [2, 'ch']],
    spoken: archWord,
  }, {
    word: 'torch',
    sounds: [[0, 't'], [1, 'oLongMore'], [2, 'r'], [3, 'ch']],
    spoken: torchWord,
  }, {
    word: 'bench',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'n'], [3, 'ch']],
    spoken: benchWord,
  }, {
    word: 'check',
    sounds: [[0, 'ch'], [2, 'eShort'], [3, 'k']],
    spoken: checkWord,
  }, {
    word: 'chain',
    sounds: [[0, 'ch'], [2, 'aLong'], [4, 'n']],
    spoken: chainWord,
  }, {
    word: 'branch',
    sounds: [[0, 'b'], [1, 'r'], [2, 'aShortAnd'], [3, 'n'], [4, 'ch']],
    spoken: branchWord,
  }, {
    word: 'bunch',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 'n'], [3, 'ch']],
    spoken: bunchWord,
  }, {
    word: 'chair',
    sounds: [[0, 'ch'], [2, 'aShortAnd'], [4, 'r']],
    spoken: chairWord,
  }, {
    word: 'chase',
    sounds: [[0, 'ch'], [2, 'aLong'], [3, 's']],
    spoken: chaseWord,
  }, {
    word: 'lunch',
    sounds: [[0, 'l'], [1, 'uShortDuck'], [2, 'n'], [3, 'ch']],
    spoken: lunchWord,
  }, {
    word: 'peach',
    sounds: [[0, 'p'], [1, 'eLong'], [3, 'ch']],
    spoken: peachWord,
  }, {
    word: 'reach',
    sounds: [[0, 'r'], [1, 'eLong'], [3, 'ch']],
    spoken: reachWord,
  }, {
    word: 'touch',
    sounds: [[0, 't'], [1, 'uShortDuck'], [3, 'ch']],
    spoken: touchWord,
  }],
});

