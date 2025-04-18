import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import showerWord from '@src/modules/common/READING/words/shower';
import toiletWord from '@src/modules/common/READING/words/toilet';
import mirrorWord from '@src/modules/common/READING/words/mirror';
import bathroomWord from '@src/modules/common/READING/words/bathroom';
import scaleWord from '@src/modules/common/READING/words/scale';
import brushWord from '@src/modules/common/READING/words/brush';
import towelWord from '@src/modules/common/READING/words/towel';
import faucetWord from '@src/modules/common/READING/words/faucet';
import bathtubWord from '@src/modules/common/READING/words/bathtub';
import flushWord from '@src/modules/common/READING/words/flush';
import robeWord from '@src/modules/common/READING/words/robe';

export let words = [
  showerWord,
  toiletWord,
  mirrorWord,
  bathroomWord,
  scaleWord,
  brushWord,
  towelWord,
  faucetWord,
  bathtubWord,
  flushWord,
  robeWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

