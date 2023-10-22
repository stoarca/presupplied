import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import knifeWord from './knife.wav';
import kneeWord from './knee.wav';
import knowWord from './know.wav';
import noWord from './no.wav';
import knotWord from './knot.wav';
import notWord from './not.wav';
import knightWord from './knight.wav';
import nightWord from './night.wav';
import knuckleWord from './knuckle.wav';
import knitWord from './knit.wav';

export default ModuleBuilder({
  variants: [{
    word: 'knife',
    sounds: [[0, 'n'], [2, 'iLong'], [3, 'f']],
    spoken: knifeWord,
  }, {
    word: 'knee',
    sounds: [[0, 'n'], [2, 'eLong']],
    spoken: kneeWord,
  }, {
    word: 'know',
    sounds: [[0, 'n'], [2, 'oLongGo']],
    spoken: knowWord,
  }, {
    word: 'no',
    sounds: [[0, 'n'], [1, 'oLongGo']],
    spoken: noWord,
  }, {
    word: 'knot',
    sounds: [[0, 'n'], [2, 'oShortMom'], [3, 't']],
    spoken: knotWord,
  }, {
    word: 'not',
    sounds: [[0, 'n'], [1, 'oShortMom'], [2, 't']],
    spoken: notWord,
  }, {
    word: 'knight',
    sounds: [[0, 'n'], [2, 'iLong'], [3, 't']],
    spoken: knightWord,
  }, {
    word: 'night',
    sounds: [[0, 'n'], [1, 'iLong'], [2, 't']],
    spoken: nightWord,
  }, {
    word: 'knuckle',
    sounds: [[0, 'n'], [2, 'uShortDuck'], [3, 'k'], [5, 'l']],
    spoken: knuckleWord,
  }, {
    word: 'knit',
    sounds: [[0, 'n'], [2, 'iShort'], [3, 't']],
    spoken: knitWord,
  }],
});

