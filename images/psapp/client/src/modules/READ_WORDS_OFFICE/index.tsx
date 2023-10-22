import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import officeWord from './office.wav';
import deskWord from './desk.wav';
import jobWord from './job.wav';
import workWord from './work.wav';
import productWord from './product.wav';
import serviceWord from './service.wav';
import businessWord from './business.wav';
import startupWord from './startup.wav';
import employeeWord from './employee.wav';
import employerWord from './employer.wav';

export default ModuleBuilder({
  variants: [{
    word: 'office',
    sounds: [[0, 'oShortMom'], [1, 'f'], [3, 'iShort'], [4, 's']],
    spoken: officeWord,
  }, {
    word: 'desk',
    sounds: [[0, 'd'], [1, 'eShort'], [2, 's'], [3, 'k']],
    spoken: deskWord,
  }, {
    word: 'job',
    sounds: [[0, 'j'], [1, 'oShortMom'], [2, 'b']],
    spoken: jobWord,
  }, {
    word: 'work',
    sounds: [[0, 'w'], [1, 'schwa'], [2, 'r'], [3, 'k']],
    spoken: workWord,
  }, {
    word: 'product',
    sounds: [[0, 'p'], [1, 'r'], [2, 'oShortMom'], [3, 'd'], [5, 'uShortDuck'], [6, 'k'], [7, 't']],
    spoken: productWord,
  }, {
    word: 'service',
    sounds: [[0, 's'], [1, 'schwa'], [2, 'r'], [3, 'v'], [4, 'iShort'], [5, 's']],
    spoken: serviceWord,
  }, {
    word: 'business',
    sounds: [[0, 'b'], [1, 'iShort'], [2, 'z'], [4, 'n'], [5, 'eShort'], [6, 's']],
    spoken: businessWord,
  }, {
    word: 'startup',
    sounds: [[0, 's'], [1, 't'], [2, 'schwa'], [3, 'r'], [4, 't'], [5, 'uShortDuck'], [6, 'p']],
    spoken: startupWord,
  }, {
    word: 'employee',
    sounds: [[0, 'eShort'], [2, 'm'], [3, 'p'], [4, 'l'], [5, 'oLongMore'], [6, 'yConsonant'], [7, 'eLong']],
    spoken: employeeWord,
  }, {
    word: 'employer',
    sounds: [[0, 'eShort'], [2, 'm'], [3, 'p'], [4, 'l'], [5, 'oLongMore'], [6, 'yConsonant'], [7, 'schwa'], [8, 'r']],
    spoken: employerWord,
  }],
});

