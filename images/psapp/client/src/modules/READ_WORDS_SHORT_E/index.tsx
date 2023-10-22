import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import betWord from './bet.wav';
import setWord from './set.wav';
import letWord from './let.wav';
import metWord from './met.wav';
import fedWord from './fed.wav';
import ledWord from './led.wav';
import tellWord from './tell.wav';
import bellWord from './bell.wav';
import wellWord from './well.wav';
import bedWord from './bed.wav';
import sellWord from './sell.wav';
import fellWord from './fell.wav';

export default ModuleBuilder({
  variants: [{
    word: 'bet',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 't']],
    spoken: betWord,
  }, {
    word: 'set',
    sounds: [[0, 's'], [1, 'eShort'], [2, 't']],
    spoken: setWord,
  }, {
    word: 'let',
    sounds: [[0, 'l'], [1, 'eShort'], [2, 't']],
    spoken: letWord,
  }, {
    word: 'met',
    sounds: [[0, 'm'], [1, 'eShort'], [2, 't']],
    spoken: metWord,
  }, {
    word: 'fed',
    sounds: [[0, 'f'], [1, 'eShort'], [2, 'd']],
    spoken: fedWord,
  }, {
    word: 'led',
    sounds: [[0, 'l'], [1, 'eShort'], [2, 'd']],
    spoken: ledWord,
  }, {
    word: 'tell',
    sounds: [[0, 't'], [1, 'eShort'], [2, 'l']],
    spoken: tellWord,
  }, {
    word: 'bell',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'l']],
    spoken: bellWord,
  }, {
    word: 'well',
    sounds: [[0, 'w'], [1, 'eShort'], [2, 'l']],
    spoken: wellWord,
  }, {
    word: 'bed',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 'd']],
    spoken: bedWord,
  }, {
    word: 'sell',
    sounds: [[0, 's'], [1, 'eShort'], [2, 'l']],
    spoken: sellWord,
  }, {
    word: 'fell',
    sounds: [[0, 'f'], [1, 'eShort'], [2, 'l']],
    spoken: fellWord,
  }],
});
