import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import acheWord from '@src/modules/common/READING/words/ache';
import schoolWord from '@src/modules/common/READING/words/school';
import anchorWord from '@src/modules/common/READING/words/anchor';
import chaosWord from '@src/modules/common/READING/words/chaos';
import charismaWord from '@src/modules/common/READING/words/charisma';
import chefWord from '@src/modules/common/READING/words/chef';
import machineWord from '@src/modules/common/READING/words/machine';
import chuteWord from '@src/modules/common/READING/words/chute';
import echoWord from '@src/modules/common/READING/words/echo';
import mechanicWord from '@src/modules/common/READING/words/mechanic';
import technologyWord from '@src/modules/common/READING/words/technology';
import yachtWord from '@src/modules/common/READING/words/yacht';

export let words = [
  acheWord,
  schoolWord,
  anchorWord,
  chaosWord,
  charismaWord,
  chefWord,
  machineWord,
  chuteWord,
  echoWord,
  mechanicWord,
  technologyWord,
  yachtWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

