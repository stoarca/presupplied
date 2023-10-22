import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import ceilingWord from './ceiling.wav';
import receiveWord from './receive.wav';
import iceWord from './ice.wav';
import exerciseWord from './exercise.wav';
import celeryWord from './celery.wav';
import circleWord from './circle.wav';
import cancelWord from './cancel.wav';
import recipeWord from './recipe.wav';
import fancyWord from './fancy.wav';

export default ModuleBuilder({
  variants: [{
    word: 'ceiling',
    sounds: [[0, 's'], [1, 'eLong'], [3, 'l'], [4, 'iShort'], [5, 'n'], [6, 'gHard']],
    spoken: ceilingWord,
  }, {
    word: 'receive',
    sounds: [[0, 'r'], [1, 'iShort'], [2, 's'], [3, 'eLong'], [5, 'v']],
    spoken: receiveWord,
  }, {
    word: 'ice',
    sounds: [[0, 'iLong'], [1, 's']],
    spoken: iceWord,
  }, {
    word: 'exercise',
    sounds: [[0, 'eShort'], [1, 'x'], [2, 'schwa'], [3, 'r'], [4, 's'], [5, 'iLong'], [6, 'z']],
    spoken: exerciseWord,
  }, {
    word: 'celery',
    sounds: [[0, 's'], [1, 'eShort'], [2, 'l'], [3, 'eShort'], [4, 'r'], [5, 'eLong']],
    spoken: celeryWord,
  }, {
    word: 'circle',
    sounds: [[0, 's'], [1, 'schwa'], [2, 'r'], [3, 'k'], [4, 'l']],
    spoken: circleWord,
  }, {
    word: 'cancel',
    sounds: [[0, 'k'], [1, 'aShortAnd'], [2, 'n'], [3, 's'], [4, 'schwa'], [5, 'l']],
    spoken: cancelWord,
  }, {
    word: 'recipe',
    sounds: [[0, 'r'], [1, 'eShort'], [2, 's'], [3, 'iShort'], [4, 'p'], [5, 'eLong']],
    spoken: recipeWord,
  }, {
    word: 'fancy',
    sounds: [[0, 'f'], [1, 'aShortAnd'], [2, 'n'], [3, 's'], [4, 'eLong']],
    spoken: fancyWord,
  }],
});
