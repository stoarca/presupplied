import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import pizzaWord from './pizza.wav';
import pastaWord from './pasta.wav';
import milkWord from './milk.wav';
import meatWord from './meat.wav';
import salamiWord from './salami.wav';
import breadWord from './bread.wav';
import fruitsWord from './fruits.wav';
import vegetablesWord from './vegetables.wav';
import beefWord from './beef.wav';
import baguetteWord from './baguette.wav';
import oatmealWord from './oatmeal.wav';
import yogurtWord from './yogurt.wav';

export default ModuleBuilder({
  variants: [{
    word: 'pizza',
    sounds: [[0, 'p'], [1, 'eLong'], [2, 't'], [3, 's'], [4, 'schwa']],
    spoken: pizzaWord,
  }, {
    word: 'pasta',
    sounds: [[0, 'p'], [1, 'aShortAre'], [2, 's'], [3, 't'], [4, 'schwa']],
    spoken: pastaWord,
  }, {
    word: 'milk',
    sounds: [[0, 'm'], [1, 'iShort'], [2, 'l'], [3, 'k']],
    spoken: milkWord,
  }, {
    word: 'meat',
    sounds: [[0, 'm'], [1, 'eLong'], [3, 't']],
    spoken: meatWord,
  }, {
    word: 'salami',
    sounds: [[0, 's'], [1, 'schwa'], [2, 'l'], [3, 'aShortAre'], [4, 'm'], [5, 'eLong']],
    spoken: salamiWord,
  }, {
    word: 'bread',
    sounds: [[0, 'b'], [1, 'r'], [2, 'eShort'], [4, 'd']],
    spoken: breadWord,
  }, {
    word: 'fruits',
    sounds: [[0, 'f'], [1, 'r'], [2, 'uLongBlue'], [4, 't'], [5, 's']],
    spoken: fruitsWord,
  }, {
    word: 'vegetables',
    sounds: [[0, 'v'], [1, 'eShort'], [2, 'j'], [4, 't'], [5, 'schwa'], [6, 'b'], [7, 'l'], [9, 'z']],
    spoken: vegetablesWord,
  }, {
    word: 'beef',
    sounds: [[0, 'b'], [1, 'eLong'], [3, 'f']],
    spoken: beefWord,
  }, {
    word: 'baguette',
    sounds: [[0, 'b'], [1, 'aShortAt'], [2, 'gHard'], [3, 'eShort'], [5, 't']],
    spoken: baguetteWord,
  }, {
    word: 'oatmeal',
    sounds: [[0, 'oLongGo'], [2, 't'], [3, 'm'], [4, 'eLong'], [6, 'l']],
    spoken: oatmealWord,
  }, {
    word: 'yogurt',
    sounds: [[0, 'yConsonant'], [1, 'oLongGo'], [2, 'gHard'], [3, 'schwa'], [4, 'r'], [5, 't']],
    spoken: yogurtWord,
  }],
});

