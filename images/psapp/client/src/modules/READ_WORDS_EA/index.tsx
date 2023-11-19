import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import seaWord from '@src/modules/common/READING/words/sea';
import earWord from '@src/modules/common/READING/words/ear';
import eatWord from '@src/modules/common/READING/words/eat';
import teaWord from '@src/modules/common/READING/words/tea';
import yearWord from '@src/modules/common/READING/words/year';
import earnWord from '@src/modules/common/READING/words/earn';
import areaWord from '@src/modules/common/READING/words/area';
import mealWord from '@src/modules/common/READING/words/meal';
import pearWord from '@src/modules/common/READING/words/pear';
import breadWord from '@src/modules/common/READING/words/bread';
import readWord from '@src/modules/common/READING/words/read';
import wearWord from '@src/modules/common/READING/words/wear';

export let words = [
  seaWord,
  earWord,
  eatWord,
  teaWord,
  yearWord,
  earnWord,
  areaWord,
  mealWord,
  pearWord,
  breadWord,
  readWord,
  wearWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
