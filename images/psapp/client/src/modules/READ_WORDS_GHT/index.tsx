import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import mightWord from './might.wav';
import fightWord from './fight.wav';
import rightWord from './right.wav';
import tightWord from './tight.wav';
import nightWord from './night.wav';
import oughtWord from './ought.wav';
import eightWord from './eight.wav';
import weightWord from './weight.wav';
import heightWord from './height.wav';
import frightWord from './fright.wav';
import brightWord from './bright.wav';
import foughtWord from './fought.wav';

export default ModuleBuilder({
  variants: [{
    word: 'might',
    sounds: [[0, 'm'], [1, 'iLong'], [2, 't']],
    spoken: mightWord,
  }, {
    word: 'fight',
    sounds: [[0, 'f'], [1, 'iLong'], [2, 't']],
    spoken: fightWord,
  }, {
    word: 'right',
    sounds: [[0, 'r'], [1, 'iLong'], [2, 't']],
    spoken: rightWord,
  }, {
    word: 'tight',
    sounds: [[0, 't'], [1, 'iLong'], [2, 't']],
    spoken: tightWord,
  }, {
    word: 'night',
    sounds: [[0, 'n'], [1, 'iLong'], [2, 't']],
    spoken: nightWord,
  }, {
    word: 'ought',
    sounds: [[0, 'oShort'], [2, 't']],
    spoken: oughtWord,
  }, {
    word: 'eight',
    sounds: [[0, 'aLong'], [2, 't']],
    spoken: eightWord,
  }, {
    word: 'weight',
    sounds: [[0, 'w'], [1, 'aLong'], [3, 't']],
    spoken: weightWord,
  }, {
    word: 'height',
    sounds: [[0, 'h'], [1, 'iLong'], [3, 't']],
    spoken: heightWord,
  }, {
    word: 'fright',
    sounds: [[0, 'f'], [1, 'r'], [2, 'iLong'], [3, 't']],
    spoken: frightWord,
  }, {
    word: 'bright',
    sounds: [[0, 'b'], [1, 'r'], [2, 'iLong'], [3, 't']],
    spoken: brightWord,
  }, {
    word: 'fought',
    sounds: [[0, 'f'], [1, 'oShort'], [3, 't']],
    spoken: foughtWord,
  }],
});
