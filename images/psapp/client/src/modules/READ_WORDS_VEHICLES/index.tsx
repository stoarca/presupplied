import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import carWord from './car.wav';
import motorcycleWord from './motorcycle.wav';
import truckWord from './truck.wav';
import airplaneWord from './airplane.wav';
import boatWord from './boat.wav';
import submarineWord from './submarine.wav';
import trainWord from './train.wav';
import bulldozerWord from './bulldozer.wav';
import taxiWord from './taxi.wav';
import busWord from './bus.wav';
import limousineWord from './limousine.wav';
import locomotiveWord from './locomotive.wav';
import rocketWord from './rocket.wav';
import subwayWord from './subway.wav';

export default ModuleBuilder({
  variants: [{
    word: 'car',
    sounds: [[0, 'k'], [1, 'aShortAre'], [2, 'r']],
    spoken: carWord,
  }, {
    word: 'motorcycle',
    sounds: [[0, 'm'], [1, 'oLongGo'], [2, 't'], [3, 'schwa'], [4, 'r'], [5, 's'], [6, 'iLong'], [7, 'k'], [8, 'l']],
    spoken: motorcycleWord,
  }, {
    word: 'truck',
    sounds: [[0, 't'], [1, 'r'], [2, 'uShortDuck'], [3, 'k']],
    spoken: truckWord,
  }, {
    word: 'airplane',
    sounds: [[0, 'eShort'], [2, 'r'], [3, 'p'], [4, 'l'], [5, 'aLong'], [6, 'n']],
    spoken: airplaneWord,
  }, {
    word: 'boat',
    sounds: [[0, 'b'], [1, 'oLongGo'], [3, 't']],
    spoken: boatWord,
  }, {
    word: 'submarine',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'b'], [3, 'm'], [4, 'schwa'], [5, 'r'], [6, 'eLong'], [7, 'n']],
    spoken: submarineWord,
  }, {
    word: 'train',
    sounds: [[0, 't'], [1, 'r'], [2, 'aLong'], [4, 'n']],
    spoken: trainWord,
  }, {
    word: 'bulldozer',
    sounds: [[0, 'b'], [1, 'uShortFull'], [2, 'l'], [4, 'd'], [5, 'oLongGo'], [6, 'z'], [7, 'schwa'], [8, 'r']],
    spoken: bulldozerWord,
  }, {
    word: 'taxi',
    sounds: [[0, 't'], [1, 'aShortAt'], [2, 'x'], [3, 'eLong']],
    spoken: taxiWord,
  }, {
    word: 'bus',
    sounds: [[0, 'b'], [1, 'uShortDuck'], [2, 's']],
    spoken: busWord,
  }, {
    word: 'limousine',
    sounds: [[0, 'l'], [1, 'iShort'], [2, 'm'], [3, 'schwa'], [5, 'z'], [6, 'eLong'], [7, 'n']],
    spoken: limousineWord,
  }, {
    word: 'locomotive',
    sounds: [[0, 'l'], [1, 'oLongGo'], [2, 'k'], [3, 'oLongGo'], [4, 'm'], [5, 'oLongGo'], [6, 't'], [7, 'iShort'], [8, 'v']],
    spoken: locomotiveWord,
  }, {
    word: 'rocket',
    sounds: [[0, 'r'], [1, 'oShortMom'], [2, 'k'], [4, 'eShort'], [5, 't']],
    spoken: rocketWord,
  }, {
    word: 'subway',
    sounds: [[0, 's'], [1, 'uShortDuck'], [2, 'b'], [3, 'w'], [4, 'aLong']],
    spoken: subwayWord,
  }],
});

