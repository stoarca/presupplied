import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import combWord from '@src/modules/common/READING/words/comb';
import climbWord from '@src/modules/common/READING/words/climb';
import bombWord from '@src/modules/common/READING/words/bomb';
import lambWord from '@src/modules/common/READING/words/lamb';
import thumbWord from '@src/modules/common/READING/words/thumb';
import tombWord from '@src/modules/common/READING/words/tomb';
import numbWord from '@src/modules/common/READING/words/numb';
import crumbWord from '@src/modules/common/READING/words/crumb';
import dumbWord from '@src/modules/common/READING/words/dumb';
import subtleWord from '@src/modules/common/READING/words/subtle';
import doubtWord from '@src/modules/common/READING/words/doubt';
import debtWord from '@src/modules/common/READING/words/debt';

export let words = [
  combWord,
  climbWord,
  bombWord,
  lambWord,
  thumbWord,
  tombWord,
  numbWord,
  crumbWord,
  dumbWord,
  subtleWord,
  doubtWord,
  debtWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

