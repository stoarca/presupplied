import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import toWord from './to.wav';
import tooWord from './too.wav';
import zooWord from './zoo.wav';
import mooWord from './moo.wav';
import foodWord from './food.wav';
import footWord from './foot.wav';
import goodWord from './good.wav';
import hookWord from './hook.wav';
import poolWord from './pool.wav';
import coolWord from './cool.wav';
import woodWord from './wood.wav';
import cookWord from './cook.wav';
import loopWord from './loop.wav';
import floorWord from './floor.wav';
import spoonWord from './spoon.wav';

export default ModuleBuilder({
  variants: [{
    word: 'to',
    sounds: [[0, 't'], [1, 'uLongBlue']],
    spoken: toWord,
  }, {
    word: 'too',
    sounds: [[0, 't'], [1, 'uLongBlue']],
    spoken: tooWord,
  }, {
    word: 'zoo',
    sounds: [[0, 'z'], [1, 'uLongBlue']],
    spoken: zooWord,
  }, {
    word: 'moo',
    sounds: [[0, 'm'], [1, 'uLongBlue']],
    spoken: mooWord,
  }, {
    word: 'food',
    sounds: [[0, 'f'], [1, 'uLongBlue'], [3, 'd']],
    spoken: foodWord,
  }, {
    word: 'foot',
    sounds: [[0, 'f'], [1, 'uLongBlue'], [3, 't']],
    spoken: footWord,
  }, {
    word: 'good',
    sounds: [[0, 'gHard'], [1, 'uLongBlue'], [3, 'd']],
    spoken: goodWord,
  }, {
    word: 'hook',
    sounds: [[0, 'h'], [1, 'uLongBlue'], [3, 'k']],
    spoken: hookWord,
  }, {
    word: 'pool',
    sounds: [[0, 'p'], [1, 'uLongBlue'], [3, 'l']],
    spoken: poolWord,
  }, {
    word: 'cool',
    sounds: [[0, 'k'], [1, 'uLongBlue'], [3, 'l']],
    spoken: coolWord,
  }, {
    word: 'wood',
    sounds: [[0, 'w'], [1, 'schwa'], [3, 'd']],
    spoken: woodWord,
  }, {
    word: 'cook',
    sounds: [[0, 'k'], [1, 'uLongBlue'], [3, 'k']],
    spoken: cookWord,
  }, {
    word: 'loop',
    sounds: [[0, 'l'], [1, 'uLongBlue'], [3, 'p']],
    spoken: loopWord,
  }, {
    word: 'floor',
    sounds: [[0, 'f'], [1, 'l'], [2, 'oLongMore'], [4, 'r']],
    spoken: floorWord,
  }, {
    word: 'spoon',
    sounds: [[0, 's'], [1, 'p'], [2, 'uLongBlue'], [4, 'n']],
    spoken: spoonWord,
  }],
});
