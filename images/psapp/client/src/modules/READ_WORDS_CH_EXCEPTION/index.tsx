import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import acheWord from './ache.wav';
import schoolWord from './school.wav';
import anchorWord from './anchor.wav';
import chaosWord from './chaos.wav';
import charismaWord from './charisma.wav';
import chefWord from './chef.wav';
import machineWord from './machine.wav';
import chuteWord from './chute.wav';
import echoWord from './echo.wav';
import mechanicWord from './mechanic.wav';
import technologyWord from './technology.wav';
import yachtWord from './yacht.wav';

export default ModuleBuilder({
  variants: [{
    word: 'ache',
    sounds: [[0, 'aLong'], [1, 'k']],
    spoken: acheWord,
  }, {
    word: 'school',
    sounds: [[0, 's'], [1, 'k'], [3, 'uLongBlue'], [5, 'l']],
    spoken: schoolWord,
  }, {
    word: 'anchor',
    sounds: [[0, 'aShortAnd'], [1, 'n'], [2, 'k'], [4, 'schwa'], [5, 'r']],
    spoken: anchorWord,
  }, {
    word: 'chaos',
    sounds: [[0, 'k'], [2, 'aLong'], [3, 'oShortMom'], [5, 's']],
    spoken: chaosWord,
  }, {
    word: 'charisma',
    sounds: [[0, 'k'], [2, 'schwa'], [3, 'r'], [4, 'iShort'], [5, 'z'], [6, 'm'], [7, 'schwa']],
    spoken: charismaWord,
  }, {
    word: 'chef',
    sounds: [[0, 'sh'], [2, 'eShort'], [3, 'f']],
    spoken: chefWord,
  }, {
    word: 'machine',
    sounds: [[0, 'm'], [1, 'schwa'], [2, 'sh'], [4, 'eLong'], [5, 'n']],
    spoken: machineWord,
  }, {
    word: 'chute',
    sounds: [[0, 'sh'], [2, 'uLongBlue'], [3, 't']],
    spoken: chuteWord,
  }, {
    word: 'echo',
    sounds: [[0, 'eShort'], [1, 'k'], [3, 'oLongGo']],
    spoken: echoWord,
  }, {
    word: 'mechanic',
    sounds: [[0, 'm'], [1, 'eShort'], [2, 'k'], [4, 'aShortAnd'], [5, 'n'], [6, 'iShort'], [7, 'k']],
    spoken: mechanicWord,
  }, {
    word: 'technology',
    sounds: [[0, 't'], [1, 'eShort'], [2, 'k'], [4, 'n'], [5, 'oShortMom'], [6, 'l'], [7, 'schwa'], [8, 'j'], [9, 'eLong']],
    spoken: technologyWord,
  }, {
    word: 'yacht',
    sounds: [[0, 'yConsonant'], [1, 'aLong'], [2, 't']],
    spoken: yachtWord,
  }],
});

