import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import parkWord from '@src/modules/common/READING/words/park';
import playgroundWord from '@src/modules/common/READING/words/playground';
import slideWord from '@src/modules/common/READING/words/slide';
import swingWord from '@src/modules/common/READING/words/swing';
import climbWord from '@src/modules/common/READING/words/climb';
import hideWord from '@src/modules/common/READING/words/hide';
import tagWord from '@src/modules/common/READING/words/tag';
import sandboxWord from '@src/modules/common/READING/words/sandbox';
import fountainWord from '@src/modules/common/READING/words/fountain';
import benchWord from '@src/modules/common/READING/words/bench';
import seesawWord from '@src/modules/common/READING/words/seesaw';

export let words = [
  parkWord,
  playgroundWord,
  slideWord,
  swingWord,
  climbWord,
  hideWord,
  tagWord,
  sandboxWord,
  fountainWord,
  benchWord,
  seesawWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

