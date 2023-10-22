import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import meWord from './me.wav';
import beWord from './be.wav';
import weWord from './we.wav';
import heWord from './he.wav';
import evenWord from './even.wav';
import hereWord from './here.wav';
import meterWord from './meter.wav';
import secretWord from './secret.wav';
import legalWord from './legal.wav';
import evilWord from './evil.wav';

export default ModuleBuilder({
  variants: [{
    word: 'me',
    sounds: [[0, 'm'], [1, 'eLong']],
    spoken: meWord,
  }, {
    word: 'be',
    sounds: [[0, 'b'], [1, 'eLong']],
    spoken: beWord,
  }, {
    word: 'we',
    sounds: [[0, 'w'], [1, 'eLong']],
    spoken: weWord,
  }, {
    word: 'he',
    sounds: [[0, 'h'], [1, 'eLong']],
    spoken: heWord,
  }, {
    word: 'even',
    sounds: [[0, 'eLong'], [1, 'v'], [2, 'eShort'], [3, 'n']],
    spoken: evenWord,
  }, {
    word: 'here',
    sounds: [[0, 'h'], [1, 'eLong'], [2, 'r']],
    spoken: hereWord,
  }, {
    word: 'meter',
    sounds: [[0, 'm'], [1, 'eLong'], [2, 't'], [3, 'eShort'], [4, 'r']],
    spoken: meterWord,
  }, {
    word: 'secret',
    sounds: [[0, 's'], [1, 'eLong'], [2, 'k'], [3, 'r'], [4, 'eShort'], [5, 't']],
    spoken: secretWord,
  }, {
    word: 'legal',
    sounds: [[0, 'l'], [1, 'eLong'], [2, 'gHard'], [3, 'aShortAre'], [4, 'l']],
    spoken: legalWord,
  }, {
    word: 'evil',
    sounds: [[0, 'eLong'], [1, 'v'], [2, 'iShort'], [3, 'l']],
    spoken: evilWord,
  }],
});
