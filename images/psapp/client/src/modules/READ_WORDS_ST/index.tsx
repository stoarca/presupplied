import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import bestWord from './best.wav';
import fastWord from './fast.wav';
import listWord from './list.wav';
import pastWord from './past.wav';
import restWord from './rest.wav';
import testWord from './test.wav';
import justWord from './just.wav';
import lastWord from './last.wav';
import rustWord from './rust.wav';
import dustWord from './dust.wav';
import stepWord from './step.wav';
import stillWord from './still.wav';
import stingWord from './sting.wav';
import stopWord from './stop.wav';

export default ModuleBuilder({
  variants: [{
    word: 'best',
    sounds: [[0, 'b'], [1, 'eShort'], [2, 's'], [3, 't']],
    spoken: bestWord,
  }, {
    word: 'fast',
    sounds: [[0, 'f'], [1, 'aShortAt'], [2, 's'], [3, 't']],
    spoken: fastWord,
  }, {
    word: 'list',
    sounds: [[0, 'l'], [1, 'iShort'], [2, 's'], [3, 't']],
    spoken: listWord,
  }, {
    word: 'past',
    sounds: [[0, 'p'], [1, 'aShortAt'], [2, 's'], [3, 't']],
    spoken: pastWord,
  }, {
    word: 'rest',
    sounds: [[0, 'r'], [1, 'eShort'], [2, 's'], [3, 't']],
    spoken: restWord,
  }, {
    word: 'test',
    sounds: [[0, 't'], [1, 'eShort'], [2, 's'], [3, 't']],
    spoken: testWord,
  }, {
    word: 'just',
    sounds: [[0, 'j'], [1, 'uShortDuck'], [2, 's'], [3, 't']],
    spoken: justWord,
  }, {
    word: 'last',
    sounds: [[0, 'l'], [1, 'aShortAt'], [2, 's'], [3, 't']],
    spoken: lastWord,
  }, {
    word: 'rust',
    sounds: [[0, 'r'], [1, 'uShortDuck'], [2, 's'], [3, 't']],
    spoken: rustWord,
  }, {
    word: 'dust',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [2, 's'], [3, 't']],
    spoken: dustWord,
  }, {
    word: 'step',
    sounds: [[0, 's'], [1, 't'], [2, 'eShort'], [3, 'p']],
    spoken: stepWord,
  }, {
    word: 'still',
    sounds: [[0, 's'], [1, 't'], [2, 'iShort'], [3, 'l']],
    spoken: stillWord,
  }, {
    word: 'sting',
    sounds: [[0, 's'], [1, 't'], [2, 'iShort'], [3, 'n'], [4, 'gHard']],
    spoken: stingWord,
  }, {
    word: 'stop',
    sounds: [[0, 's'], [1, 't'], [2, 'oShortMom'], [3, 'p']],
    spoken: stopWord,
  }],
});
