import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import cutWord from './cut.wav';
import gumWord from './gum.wav';
import hutWord from './hut.wav';
import jugWord from './jug.wav';
import mudWord from './mud.wav';
import nutWord from './nut.wav';
import pupWord from './pup.wav';
import runWord from './run.wav';
import subWord from './sub.wav';
import tugWord from './tug.wav';
import busWord from './bus.wav';
import cupWord from './cup.wav';
import funWord from './fun.wav';
import lugWord from './lug.wav';
import sumWord from './sum.wav';

export default ModuleBuilder({
  variants: [{
    word: 'cut',
    sounds: [[0, 'k'], [1, 'uShortDuck'], [2, 't']],
    spoken: cutWord,
  }, {
    word: 'gum',
    sounds: [[0, 'gHard'], [1, 'uShortDuck'], [2, 'm']],
    spoken: gumWord,
  }, {
    word: 'hut',
    sounds: [[0, 'h'], [1, 'uShortDuck'], [2, 't']],
    spoken: hutWord,
  }, {
    word: 'jug',
    sounds: [[0, 'j'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: jugWord,
  }, {
    word: 'mud',
    sounds: [[0, 'm'], [1, 'uShortDuck'], [2, 'd']],
    spoken: mudWord,
  }, {
    word: 'nut',
    sounds: [[0, 'n'], [1, 'uShortDuck'], [2, 't']],
    spoken: nutWord,
  }, {
    word: 'pup',
    sounds: [[0, 'p'], [1, 'uShortDuck'], [2, 'p']],
    spoken: pupWord,
  }, {
    word: 'run',
    sounds: [[0, 'r'], [1, 'uShortDuck'], [2, 'n']],
    spoken: runWord,
  }, {
    word: 'sub',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'b']],
    spoken: subWord,
  }, {
    word: 'tug',
    sounds: [[0, 't'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: tugWord,
  }, {
    word: 'bus',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 's']],
    spoken: busWord,
  }, {
    word: 'cup',
    sounds: [[0, 'k'], [1, 'uShortDuck'], [2, 'p']],
    spoken: cupWord,
  }, {
    word: 'fun',
    sounds: [[0, 'f'], [1, 'uShortDuck'], [2, 'n']],
    spoken: funWord,
  }, {
    word: 'lug',
    sounds: [[0, 'l'], [1, 'uShortDuck'], [2, 'gHard']],
    spoken: lugWord,
  }, {
    word: 'sum',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'm']],
    spoken: sumWord,
  }],
});
