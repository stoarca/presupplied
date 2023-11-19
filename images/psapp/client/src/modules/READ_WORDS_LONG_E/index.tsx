import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import meWord from '@src/modules/common/READING/words/me';
import beWord from '@src/modules/common/READING/words/be';
import weWord from '@src/modules/common/READING/words/we';
import heWord from '@src/modules/common/READING/words/he';
import evenWord from '@src/modules/common/READING/words/even';
import hereWord from '@src/modules/common/READING/words/here';
import meterWord from '@src/modules/common/READING/words/meter';
import secretWord from '@src/modules/common/READING/words/secret';
import legalWord from '@src/modules/common/READING/words/legal';
import evilWord from '@src/modules/common/READING/words/evil';

export let words = [
  meWord,
  beWord,
  weWord,
  heWord,
  evenWord,
  hereWord,
  meterWord,
  secretWord,
  legalWord,
  evilWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
