import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import thinkWord from './think.wav';
import thingWord from './thing.wav';
import bathWord from './bath.wav';
import birthdayWord from './birthday.wav';
import mathWord from './math.wav';
import monthWord from './month.wav';
import teethWord from './teeth.wav';
import thanksWord from './thanks.wav';
import thickWord from './thick.wav';
import thinWord from './thin.wav';
import withWord from './with.wav';

export default ModuleBuilder({
  variants: [{
    word: 'think',
    sounds: [[0, 'thThink'], [2, 'iShort'], [3, 'n'], [4, 'k']],
    spoken: thinkWord,
  }, {
    word: 'thing',
    sounds: [[0, 'thThink'], [2, 'iShort'], [3, 'n'], [4, 'gHard']],
    spoken: thingWord,
  }, {
    word: 'bath',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'thThink']],
    spoken: bathWord,
  }, {
    word: 'birthday',
    sounds: [[0, 'b'], [1, 'schwa'], [2, 'r'], [3, 'thThink'], [5, 'd'], [6, 'aLong']],
    spoken: birthdayWord,
  }, {
    word: 'math',
    sounds: [[0, 'm'], [1, 'aShortAt'], [2, 'thThink']],
    spoken: mathWord,
  }, {
    word: 'month',
    sounds: [[0, 'm'], [1, 'schwa'], [2, 'n'], [3, 'thThink']],
    spoken: monthWord,
  }, {
    word: 'teeth',
    sounds: [[0, 't'], [1, 'eLong'], [3, 'thThink']],
    spoken: teethWord,
  }, {
    word: 'thanks',
    sounds: [[0, 'thThink'], [2, 'aShortAnd'], [3, 'n'], [4, 'k'], [5, 's']],
    spoken: thanksWord,
  }, {
    word: 'thick',
    sounds: [[0, 'thThink'], [2, 'iShort'], [3, 'k']],
    spoken: thickWord,
  }, {
    word: 'thin',
    sounds: [[0, 'thThink'], [2, 'iShort'], [3, 'n']],
    spoken: thinWord,
  }, {
    word: 'with',
    sounds: [[0, 'w'], [1, 'iShort'], [2, 'thThink']],
    spoken: withWord,
  }],
});

