import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import yesWord from './yes.wav';
import yellWord from './yell.wav';
import yamWord from './yam.wav';
import yardWord from './yard.wav';
import yarnWord from './yarn.wav';
import yetWord from './yet.wav';
import yumWord from './yum.wav';
import yapWord from './yap.wav';

export default ModuleBuilder({
  variants: [{
    word: 'yes',
    sounds: [[0, 'yConsonant'], [1, 'eShort'], [2, 's']],
    spoken: yesWord,
  }, {
    word: 'yell',
    sounds: [[0, 'yConsonant'], [1, 'eShort'], [2, 'l']],
    spoken: yellWord,
  }, {
    word: 'yam',
    sounds: [[0, 'yConsonant'], [1, 'aShortAnd'], [2, 'm']],
    spoken: yamWord,
  }, {
    word: 'yard',
    sounds: [[0, 'yConsonant'], [1, 'aShortAre'], [2, 'r'], [3, 'd']],
    spoken: yardWord,
  }, {
    word: 'yarn',
    sounds: [[0, 'yConsonant'], [1, 'aShortAre'], [2, 'r'], [3, 'n']],
    spoken: yarnWord,
  }, {
    word: 'yet',
    sounds: [[0, 'yConsonant'], [1, 'eShort'], [2, 't']],
    spoken: yetWord,
  }, {
    word: 'yum',
    sounds: [[0, 'yConsonant'], [1, 'uShortDuck'], [2, 'm']],
    spoken: yumWord,
  }, {
    word: 'yap',
    sounds: [[0, 'yConsonant'], [1, 'aShortAt'], [2, 'p']],
    spoken: yapWord,
  }],
});
