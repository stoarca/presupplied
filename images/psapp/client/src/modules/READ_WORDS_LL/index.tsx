import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import willWord from './will.wav';
import hillWord from './hill.wav';
import dullWord from './dull.wav';
import tallWord from './tall.wav';
import smellWord from './smell.wav';
import allowWord from './allow.wav';
import dollarWord from './dollar.wav';
import fellowWord from './fellow.wav';
import followWord from './follow.wav';
import millionWord from './million.wav';

export default ModuleBuilder({
  variants: [{
    word: 'will',
    sounds: [[0, 'w'], [1, 'iShort'], [2, 'l']],
    spoken: willWord,
  }, {
    word: 'hill',
    sounds: [[0, 'h'], [1, 'iShort'], [2, 'l']],
    spoken: hillWord,
  }, {
    word: 'dull',
    sounds: [[0, 'd'], [1, 'uShortDuck'], [2, 'l']],
    spoken: dullWord,
  }, {
    word: 'tall',
    sounds: [[0, 't'], [1, 'aShortAre'], [2, 'l']],
    spoken: tallWord,
  }, {
    word: 'smell',
    sounds: [[0, 's'], [1, 'm'], [2, 'eShort'], [3, 'l']],
    spoken: smellWord,
  }, {
    word: 'allow',
    sounds: [[0, 'schwa'], [1, 'l'], [3, 'TODO']],
    spoken: allowWord,
  }, {
    word: 'dollar',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'l'], [4, 'schwa'], [5, 'r']],
    spoken: dollarWord,
  }, {
    word: 'fellow',
    sounds: [[0, 'f'], [1, 'eShort'], [2, 'l'], [4, 'oLongGo']],
    spoken: fellowWord,
  }, {
    word: 'follow',
    sounds: [[0, 'f'], [1, 'oShortMom'], [2, 'l'], [4, 'oLongGo']],
    spoken: followWord,
  }, {
    word: 'million',
    sounds: [[0, 'm'], [1, 'iShort'], [2, 'l'], [3, 'iShort'], [4, 'schwa'], [5, 'n']],
    spoken: millionWord,
  }],
});

