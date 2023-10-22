import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import mayWord from './may.wav';
import layWord from './lay.wav';
import payWord from './pay.wav';
import sayWord from './say.wav';
import dayWord from './day.wav';
import wayWord from './way.wav';
import playWord from './play.wav';
import layerWord from './layer.wav';
import alwaysWord from './always.wav';
import todayWord from './today.wav';
import okayWord from './okay.wav';

export default ModuleBuilder({
  variants: [{
    word: 'may',
    sounds: [[0, 'm'], [1, 'aLong']],
    spoken: mayWord,
  }, {
    word: 'lay',
    sounds: [[0, 'l'], [1, 'aLong']],
    spoken: layWord,
  }, {
    word: 'pay',
    sounds: [[0, 'p'], [1, 'aLong']],
    spoken: payWord,
  }, {
    word: 'say',
    sounds: [[0, 's'], [1, 'aLong']],
    spoken: sayWord,
  }, {
    word: 'day',
    sounds: [[0, 'd'], [1, 'aLong']],
    spoken: dayWord,
  }, {
    word: 'way',
    sounds: [[0, 'w'], [1, 'aLong']],
    spoken: wayWord,
  }, {
    word: 'play',
    sounds: [[0, 'p'], [1, 'l'], [2, 'aLong']],
    spoken: playWord,
  }, {
    word: 'layer',
    sounds: [[0, 'l'], [1, 'aLong'], [2, 'yConsonant'], [3, 'eShort'], [4, 'r']],
    spoken: layerWord,
  }, {
    word: 'always',
    sounds: [[0, 'aShortAre'], [1, 'l'], [2, 'w'], [3, 'aLong'], [5, 'z']],
    spoken: alwaysWord,
  }, {
    word: 'today',
    sounds: [[0, 't'], [1, 'uLongBlue'], [2, 'd'], [3, 'aLong']],
    spoken: todayWord,
  }, {
    word: 'okay',
    sounds: [[0, 'oShortMom'], [1, 'k'], [2, 'aLong']],
    spoken: okayWord,
  }],
});
