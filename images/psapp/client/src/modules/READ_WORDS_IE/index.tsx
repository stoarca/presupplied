import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tieWord from './tie.wav';
import dieWord from './die.wav';
import lieWord from './lie.wav';
import pieWord from './pie.wav';
import viewWord from './view.wav';
import fieldWord from './field.wav';
import briefWord from './brief.wav';
import movieWord from './movie.wav';
import genieWord from './genie.wav';
import friendWord from './friend.wav';
import alienWord from './alien.wav';

export default ModuleBuilder({
  variants: [{
    word: 'tie',
    sounds: [[0, 't'], [1, 'iLong']],
    spoken: tieWord,
  }, {
    word: 'die',
    sounds: [[0, 'd'], [1, 'iLong']],
    spoken: dieWord,
  }, {
    word: 'lie',
    sounds: [[0, 'l'], [1, 'iLong']],
    spoken: lieWord,
  }, {
    word: 'pie',
    sounds: [[0, 'p'], [1, 'iLong']],
    spoken: pieWord,
  }, {
    word: 'view',
    sounds: [[0, 'v'], [1, 'uLongMute']],
    spoken: viewWord,
  }, {
    word: 'field',
    sounds: [[0, 'f'], [1, 'eLong'], [3, 'l'], [4, 'd']],
    spoken: fieldWord,
  }, {
    word: 'brief',
    sounds: [[0, 'b'], [1, 'r'], [2, 'eLong'], [4, 'f']],
    spoken: briefWord,
  }, {
    word: 'movie',
    sounds: [[0, 'm'], [1, 'uLongBlue'], [2, 'v'], [3, 'eLong']],
    spoken: movieWord,
  }, {
    word: 'genie',
    sounds: [[0, 'j'], [1, 'eLong'], [2, 'n'], [3, 'eLong']],
    spoken: genieWord,
  }, {
    word: 'friend',
    sounds: [[0, 'f'], [1, 'r'], [2, 'eShort'], [4, 'n'], [5, 'd']],
    spoken: friendWord,
  }, {
    word: 'alien',
    sounds: [[0, 'aLong'], [1, 'l'], [2, 'eLong'], [3, 'eShort'], [4, 'n']],
    spoken: alienWord,
  }],
});
