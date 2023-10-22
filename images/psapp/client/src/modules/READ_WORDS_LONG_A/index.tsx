import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import cakeWord from './cake.wav';
import lakeWord from './lake.wav';
import gateWord from './gate.wav';
import grapeWord from './grape.wav';
import flameWord from './flame.wav';
import planeWord from './plane.wav';
import braveWord from './brave.wav';
import pasteWord from './paste.wav';
import bakeWord from './bake.wav';
import gameWord from './game.wav';
import taleWord from './tale.wav';

export default ModuleBuilder({
  variants: [{
    word: 'cake',
    sounds: [[0, 'k'], [1, 'aLong'], [2, 'k']],
    spoken: cakeWord,
  }, {
    word: 'lake',
    sounds: [[0, 'l'], [1, 'aLong'], [2, 'k']],
    spoken: lakeWord,
  }, {
    word: 'gate',
    sounds: [[0, 'gHard'], [1, 'aLong'], [2, 't']],
    spoken: gateWord,
  }, {
    word: 'grape',
    sounds: [[0, 'gHard'], [1, 'r'], [2, 'aLong'], [3, 'p']],
    spoken: grapeWord,
  }, {
    word: 'flame',
    sounds: [[0, 'f'], [1, 'l'], [2, 'aLong'], [3, 'm']],
    spoken: flameWord,
  }, {
    word: 'plane',
    sounds: [[0, 'p'], [1, 'l'], [2, 'aLong'], [3, 'n']],
    spoken: planeWord,
  }, {
    word: 'brave',
    sounds: [[0, 'b'], [1, 'r'], [2, 'aLong'], [3, 'v']],
    spoken: braveWord,
  }, {
    word: 'paste',
    sounds: [[0, 'p'], [1, 'aLong'], [2, 's'], [3, 't']],
    spoken: pasteWord,
  }, {
    word: 'bake',
    sounds: [[0, 'b'], [1, 'aLong'], [2, 'k']],
    spoken: bakeWord,
  }, {
    word: 'game',
    sounds: [[0, 'gHard'], [1, 'aLong'], [2, 'm']],
    spoken: gameWord,
  }, {
    word: 'tale',
    sounds: [[0, 't'], [1, 'aLong'], [2, 'l']],
    spoken: taleWord,
  }],
});
