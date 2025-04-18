import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import gapWord from '@src/modules/common/READING/words/gap';
import gaspWord from '@src/modules/common/READING/words/gasp';
import golfWord from '@src/modules/common/READING/words/golf';
import gripWord from '@src/modules/common/READING/words/grip';
import getWord from '@src/modules/common/READING/words/get';
import gumWord from '@src/modules/common/READING/words/gum';
import gasWord from '@src/modules/common/READING/words/gas';
import logWord from '@src/modules/common/READING/words/log';
import bagWord from '@src/modules/common/READING/words/bag';
import hugWord from '@src/modules/common/READING/words/hug';
import bugWord from '@src/modules/common/READING/words/bug';

export let words = [
  gapWord,
  gaspWord,
  golfWord,
  gripWord,
  getWord,
  gumWord,
  gasWord,
  logWord,
  bagWord,
  hugWord,
  bugWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
