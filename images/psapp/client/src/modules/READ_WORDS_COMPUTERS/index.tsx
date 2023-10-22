import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import computerWord from './computer.wav';
import tabletWord from './tablet.wav';
import smartphoneWord from './smartphone.wav';
import applicationWord from './application.wav';
import mouseWord from './mouse.wav';
import keyboardWord from './keyboard.wav';
import screenWord from './screen.wav';
import monitorWord from './monitor.wav';
import cablesWord from './cables.wav';
import graphicsWord from './graphics.wav';
import displayWord from './display.wav';
import windowWord from './window.wav';
import programWord from './program.wav';

export default ModuleBuilder({
  variants: [
    {
      word: 'computer',
      sounds: [[0, 'k'], [1, 'schwa'], [2, 'm'], [3, 'p'], [4, 'uLongMute'], [5, 't'], [6, 'schwa'], [7, 'r']],
      spoken: computerWord,
    },
    {
      word: 'tablet',
      sounds: [[0, 't'], [1, 'aShortAt'], [2, 'b'], [3, 'l'], [4, 'eShort'], [5, 't']],
      spoken: tabletWord,
    },
    {
      word: 'smartphone',
      sounds: [[0, 's'], [1, 'm'], [2, 'aShortAre'], [3, 'r'], [4, 't'], [5, 'f'], [7, 'oLongGo'], [8, 'n']],
      spoken: smartphoneWord,
    },
    {
      word: 'application',
      sounds: [[0, 'aShortAt'], [1, 'p'], [3, 'l'], [4, 'iShort'], [5, 'k'], [6, 'aLong'], [7, 'sh'], [9, 'schwa'], [10, 'n']],
      spoken: applicationWord,
    },
    {
      word: 'mouse',
      sounds: [[0, 'm'], [1, 'oShortOut'], [2, 'uShortFull'], [3, 's']],
      spoken: mouseWord,
    },
    {
      word: 'keyboard',
      sounds: [[0, 'k'], [1, 'eLong'], [3, 'b'], [4, 'oLongMore'], [6, 'r'], [7, 'd']],
      spoken: keyboardWord,
    },
    {
      word: 'screen',
      sounds: [[0, 's'], [1, 'k'], [2, 'r'], [3, 'eLong'], [5, 'n']],
      spoken: screenWord,
    },
    {
      word: 'monitor',
      sounds: [[0, 'm'], [1, 'oShortMom'], [2, 'n'], [3, 'iShort'], [4, 't'], [5, 'schwa'], [6, 'r']],
      spoken: monitorWord,
    },
    {
      word: 'cables',
      sounds: [[0, 'k'], [1, 'aLong'], [2, 'b'], [3, 'l'], [5, 'z']],
      spoken: cablesWord,
    },
    {
      word: 'graphics',
      sounds: [[0, 'gHard'], [1, 'r'], [2, 'aShortAt'], [3, 'f'], [5, 'iShort'], [6, 'k'], [7, 's']],
      spoken: graphicsWord,
    },
    {
      word: 'display',
      sounds: [[0, 'd'], [1, 'iShort'], [2, 's'], [3, 'p'], [4, 'l'], [5, 'aLong']],
      spoken: displayWord,
    },
    {
      word: 'window',
      sounds: [[0, 'w'], [1, 'iShort'], [2, 'n'], [3, 'd'], [4, 'oLongGo'], [5, 'w']],
      spoken: windowWord,
    },
    {
      word: 'program',
      sounds: [[0, 'p'], [1, 'r'], [2, 'oLongGo'], [3, 'gHard'], [4, 'r'], [5, 'aShortAnd'], [6, 'm']],
      spoken: programWord,
    },
  ],
});

