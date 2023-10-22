import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import binWord from './bin.wav';
import sitWord from './sit.wav';
import litWord from './lit.wav';
import didWord from './did.wav';
import hidWord from './hid.wav';
import kidWord from './kid.wav';
import lidWord from './lid.wav';
import pigWord from './pig.wav';
import bigWord from './big.wav';
import digWord from './dig.wav';
import himWord from './him.wav';
import ripWord from './rip.wav';
import sipWord from './sip.wav';
import mixWord from './mix.wav';

export default ModuleBuilder({
  variants: [{
    word: 'bin',
    sounds: [[0, 'b'], [1, 'iShort'], [2, 'n']],
    spoken: binWord,
  }, {
    word: 'sit',
    sounds: [[0, 's'], [1, 'iShort'], [2, 't']],
    spoken: sitWord,
  }, {
    word: 'lit',
    sounds: [[0, 'l'], [1, 'iShort'], [2, 't']],
    spoken: litWord,
  }, {
    word: 'did',
    sounds: [[0, 'd'], [1, 'iShort'], [2, 'd']],
    spoken: didWord,
  }, {
    word: 'hid',
    sounds: [[0, 'h'], [1, 'iShort'], [2, 'd']],
    spoken: hidWord,
  }, {
    word: 'kid',
    sounds: [[0, 'k'], [1, 'iShort'], [2, 'd']],
    spoken: kidWord,
  }, {
    word: 'lid',
    sounds: [[0, 'l'], [1, 'iShort'], [2, 'd']],
    spoken: lidWord,
  }, {
    word: 'pig',
    sounds: [[0, 'p'], [1, 'iShort'], [2, 'gHard']],
    spoken: pigWord,
  }, {
    word: 'big',
    sounds: [[0, 'b'], [1, 'iShort'], [2, 'gHard']],
    spoken: bigWord,
  }, {
    word: 'dig',
    sounds: [[0, 'd'], [1, 'iShort'], [2, 'gHard']],
    spoken: digWord,
  }, {
    word: 'him',
    sounds: [[0, 'h'], [1, 'iShort'], [2, 'm']],
    spoken: himWord,
  }, {
    word: 'rip',
    sounds: [[0, 'r'], [1, 'iShort'], [2, 'p']],
    spoken: ripWord,
  }, {
    word: 'sip',
    sounds: [[0, 's'], [1, 'iShort'], [2, 'p']],
    spoken: sipWord,
  }, {
    word: 'mix',
    sounds: [[0, 'm'], [1, 'iShort'], [2, 'x']],
    spoken: mixWord,
  }],
});
