import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import mightWord from '@src/modules/common/READING/words/might';
import fightWord from '@src/modules/common/READING/words/fight';
import rightWord from '@src/modules/common/READING/words/right';
import tightWord from '@src/modules/common/READING/words/tight';
import nightWord from '@src/modules/common/READING/words/night';
import oughtWord from '@src/modules/common/READING/words/ought';
import eightWord from '@src/modules/common/READING/words/eight';
import weightWord from '@src/modules/common/READING/words/weight';
import heightWord from '@src/modules/common/READING/words/height';
import frightWord from '@src/modules/common/READING/words/fright';
import brightWord from '@src/modules/common/READING/words/bright';
import foughtWord from '@src/modules/common/READING/words/fought';

export let words = [
  mightWord,
  fightWord,
  rightWord,
  tightWord,
  nightWord,
  oughtWord,
  eightWord,
  weightWord,
  heightWord,
  frightWord,
  brightWord,
  foughtWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
