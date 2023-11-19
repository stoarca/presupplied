import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import rideWord from '@src/modules/common/READING/words/ride';
import timeWord from '@src/modules/common/READING/words/time';
import findWord from '@src/modules/common/READING/words/find';
import likeWord from '@src/modules/common/READING/words/like';
import lineWord from '@src/modules/common/READING/words/line';
import mineWord from '@src/modules/common/READING/words/mine';
import sideWord from '@src/modules/common/READING/words/side';
import wipeWord from '@src/modules/common/READING/words/wipe';
import fireWord from '@src/modules/common/READING/words/fire';
import bikeWord from '@src/modules/common/READING/words/bike';
import lifeWord from '@src/modules/common/READING/words/life';
import sizeWord from '@src/modules/common/READING/words/size';

export let words = [
  rideWord,
  timeWord,
  findWord,
  likeWord,
  lineWord,
  mineWord,
  sideWord,
  wipeWord,
  fireWord,
  bikeWord,
  lifeWord,
  sizeWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
