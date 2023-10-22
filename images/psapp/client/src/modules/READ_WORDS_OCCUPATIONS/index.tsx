import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import engineerWord from './engineer.wav';
import astronautWord from './astronaut.wav';
import firefighterWord from './firefighter.wav';
import doctorWord from './doctor.wav';
import painterWord from './painter.wav';
import plumberWord from './plumber.wav';
import driverWord from './driver.wav';
import chefWord from './chef.wav';
import actorWord from './actor.wav';
import mechanicWord from './mechanic.wav';
import accountantWord from './accountant.wav';
import custodianWord from './custodian.wav';

export default ModuleBuilder({
  variants: [{
    word: 'engineer',
    sounds: [[0, 'eShort'], [1, 'n'], [2, 'j'], [3, 'iLong'], [4, 'n'], [5, 'eLong'], [7, 'r']],
    spoken: engineerWord,
  }, {
    word: 'astronaut',
    sounds: [[0, 'aShortAt'], [1, 's'], [2, 't'], [3, 'r'], [4, 'schwa'], [5, 'n'], [6, 'aShortAre'], [8, 't']],
    spoken: astronautWord,
  }, {
    word: 'firefighter',
    sounds: [[0, 'f'], [1, 'iLong'], [2, 'r'], [4, 'f'], [5, 'iLong'], [6, 't'], [9, 'schwa'], [10, 'r']],
    spoken: firefighterWord,
  }, {
    word: 'doctor',
    sounds: [[0, 'd'], [1, 'oShortMom'], [2, 'k'], [3, 't'], [4, 'schwa'], [5, 'r']],
    spoken: doctorWord,
  }, {
    word: 'painter',
    sounds: [[0, 'p'], [1, 'aLong'], [3, 'n'], [4, 't'], [5, 'schwa'], [6, 'r']],
    spoken: painterWord,
  }, {
    word: 'plumber',
    sounds: [[0, 'p'], [1, 'l'], [2, 'uShortDuck'], [3, 'm'], [5, 'schwa'], [6, 'r']],
    spoken: plumberWord,
  }, {
    word: 'driver',
    sounds: [[0, 'd'], [1, 'r'], [2, 'iLong'], [3, 'v'], [4, 'schwa'], [5, 'r']],
    spoken: driverWord,
  }, {
    word: 'chef',
    sounds: [[0, 'sh'], [2, 'eShort'], [3, 'f']],
    spoken: chefWord,
  }, {
    word: 'actor',
    sounds: [[0, 'aShortAt'], [1, 'k'], [2, 't'], [3, 'schwa'], [4, 'r']],
    spoken: actorWord,
  }, {
    word: 'mechanic',
    sounds: [[0, 'm'], [1, 'eShort'], [2, 'k'], [4, 'aShortAnd'], [5, 'n'], [6, 'iShort'], [7, 'k']],
    spoken: mechanicWord,
  }, {
    word: 'accountant',
    sounds: [[0, 'schwa'], [1, 'k'], [3, 'oShortOut'], [4, 'uShortFull'], [5, 'n'], [6, 't'], [7, 'aShortAnd'], [8, 'n'], [9, 't']],
    spoken: accountantWord,
  }, {
    word: 'custodian',
    sounds: [[0, 'k'], [1, 'uShortDuck'], [2, 's'], [3, 't'], [4, 'oLongGo'], [5, 'd'], [6, 'eLong'], [7, 'schwa'], [8, 'n']],
    spoken: custodianWord,
  }],
});

