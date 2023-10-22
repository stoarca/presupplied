import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import seaWord from './sea.wav';
import earWord from './ear.wav';
import eatWord from './eat.wav';
import teaWord from './tea.wav';
import yearWord from './year.wav';
import earnWord from './earn.wav';
import areaWord from './area.wav';
import mealWord from './meal.wav';
import pearWord from './pear.wav';
import breadWord from './bread.wav';
import readWord from './read.wav';
import wearWord from './wear.wav';

export default ModuleBuilder({
  variants: [{
    word: 'sea',
    sounds: [[0, 's'], [1, 'eLong']],
    spoken: seaWord,
  }, {
    word: 'ear',
    sounds: [[0, 'eLong'], [2, 'r']],
    spoken: earWord,
  }, {
    word: 'eat',
    sounds: [[0, 'eLong'], [2, 't']],
    spoken: eatWord,
  }, {
    word: 'tea',
    sounds: [[0, 't'], [1, 'eLong']],
    spoken: teaWord,
  }, {
    word: 'year',
    sounds: [[0, 'yConsonant'], [1, 'eLong'], [3, 'r']],
    spoken: yearWord,
  }, {
    word: 'earn',
    sounds: [[0, 'eLong'], [2, 'r'], [3, 'n']],
    spoken: earnWord,
  }, {
    word: 'area',
    sounds: [[0, 'aShortAnd'], [1, 'r'], [2, 'eLong'], [3, 'schwa']],
    spoken: areaWord,
  }, {
    word: 'meal',
    sounds: [[0, 'm'], [1, 'eLong'], [3, 'l']],
    spoken: mealWord,
  }, {
    word: 'pear',
    sounds: [[0, 'p'], [1, 'eLong'], [3, 'r']],
    spoken: pearWord,
  }, {
    word: 'bread',
    sounds: [[0, 'b'], [1, 'r'], [2, 'eShort'], [4, 'd']],
    spoken: breadWord,
  }, {
    word: 'read',
    sounds: [[0, 'r'], [1, 'eLong'], [3, 'd']],
    spoken: readWord,
  }, {
    word: 'wear',
    sounds: [[0, 'w'], [1, 'eLong'], [3, 'r']],
    spoken: wearWord,
  }],
});
