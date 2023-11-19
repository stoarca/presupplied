import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import mayWord from '@src/modules/common/READING/words/may';
import layWord from '@src/modules/common/READING/words/lay';
import payWord from '@src/modules/common/READING/words/pay';
import sayWord from '@src/modules/common/READING/words/say';
import dayWord from '@src/modules/common/READING/words/day';
import wayWord from '@src/modules/common/READING/words/way';
import playWord from '@src/modules/common/READING/words/play';
import layerWord from '@src/modules/common/READING/words/layer';
import alwaysWord from '@src/modules/common/READING/words/always';
import todayWord from '@src/modules/common/READING/words/today';
import okayWord from '@src/modules/common/READING/words/okay';

export let words = [
  mayWord,
  layWord,
  payWord,
  sayWord,
  dayWord,
  wayWord,
  playWord,
  layerWord,
  alwaysWord,
  todayWord,
  okayWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
