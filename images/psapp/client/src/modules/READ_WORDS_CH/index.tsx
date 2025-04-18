import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import archWord from '@src/modules/common/READING/words/arch';
import torchWord from '@src/modules/common/READING/words/torch';
import benchWord from '@src/modules/common/READING/words/bench';
import checkWord from '@src/modules/common/READING/words/check';
import chainWord from '@src/modules/common/READING/words/chain';
import branchWord from '@src/modules/common/READING/words/branch';
import bunchWord from '@src/modules/common/READING/words/bunch';
import chairWord from '@src/modules/common/READING/words/chair';
import chaseWord from '@src/modules/common/READING/words/chase';
import lunchWord from '@src/modules/common/READING/words/lunch';
import peachWord from '@src/modules/common/READING/words/peach';
import reachWord from '@src/modules/common/READING/words/reach';
import touchWord from '@src/modules/common/READING/words/touch';

export let words = [
  archWord,
  torchWord,
  benchWord,
  checkWord,
  chainWord,
  branchWord,
  bunchWord,
  chairWord,
  chaseWord,
  lunchWord,
  peachWord,
  reachWord,
  touchWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

