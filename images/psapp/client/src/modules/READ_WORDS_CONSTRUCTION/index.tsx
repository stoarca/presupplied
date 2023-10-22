import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import buildingWord from './building.wav';
import craneWord from './crane.wav';
import cementWord from './cement.wav';
import asphaltWord from './asphalt.wav';
import repairWord from './repair.wav';
import renovationWord from './renovation.wav';
import bridgeWord from './bridge.wav';
import tunnelWord from './tunnel.wav';
import demolitionWord from './demolition.wav';
import constructionWord from './construction.wav';

export default ModuleBuilder({
  variants: [{
    word: 'building',
    sounds: [[0, 'b'], [1, 'iShort'], [3, 'l'], [4, 'd'], [5, 'iShort'], [6, 'n'], [7, 'gHard']],
    spoken: buildingWord,
  }, {
    word: 'crane',
    sounds: [[0, 'k'], [1, 'r'], [2, 'aLong'], [3, 'n']],
    spoken: craneWord,
  }, {
    word: 'cement',
    sounds: [[0, 's'], [1, 'eShort'], [2, 'm'], [3, 'eShort'], [4, 'n'], [5, 't']],
    spoken: cementWord,
  }, {
    word: 'asphalt',
    sounds: [[0, 'aShortAt'], [1, 's'], [2, 'f'], [3, 'aShortAre'], [4, 'l'], [5, 't']],
    spoken: asphaltWord,
  }, {
    word: 'repair',
    sounds: [[0, 'r'], [1, 'iShort'], [2, 'p'], [3, 'eShort'], [5, 'r']],
    spoken: repairWord,
  }, {
    word: 'renovation',
    sounds: [[0, 'r'], [1, 'eShort'], [2, 'n'], [3, 'schwa'], [4, 'v'], [5, 'aLong'], [6, 'sh'], [7, 'schwa'], [8, 'n']],
    spoken: renovationWord,
  }, {
    word: 'bridge',
    sounds: [[0, 'b'], [1, 'r'], [2, 'iShort'], [3, 'j']],
    spoken: bridgeWord,
  }, {
    word: 'tunnel',
    sounds: [[0, 't'], [1, 'uShortDuck'], [2, 'n'], [4, 'schwa'], [5, 'l']],
    spoken: tunnelWord,
  }, {
    word: 'demolition',
    sounds: [[0, 'd'], [1, 'eShort'], [2, 'm'], [3, 'schwa'], [4, 'l'], [5, 'iShort'], [6, 'sh'], [8, 'schwa'], [9, 'n']],
    spoken: demolitionWord,
  }, {
    word: 'construction',
    sounds: [[0, 'k'], [1, 'schwa'], [2, 'n'], [3, 's'], [4, 't'], [5, 'r'], [6, 'uShortDuck'], [7, 'k'], [8, 'sh'], [10, 'schwa'], [11, 'n']],
    spoken: constructionWord,
  }],
});

