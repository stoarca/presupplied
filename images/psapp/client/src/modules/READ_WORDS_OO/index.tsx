import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import toWord from '@src/modules/common/READING/words/to';
import tooWord from '@src/modules/common/READING/words/too';
import zooWord from '@src/modules/common/READING/words/zoo';
import mooWord from '@src/modules/common/READING/words/moo';
import foodWord from '@src/modules/common/READING/words/food';
import footWord from '@src/modules/common/READING/words/foot';
import goodWord from '@src/modules/common/READING/words/good';
import hookWord from '@src/modules/common/READING/words/hook';
import poolWord from '@src/modules/common/READING/words/pool';
import coolWord from '@src/modules/common/READING/words/cool';
import woodWord from '@src/modules/common/READING/words/wood';
import cookWord from '@src/modules/common/READING/words/cook';
import loopWord from '@src/modules/common/READING/words/loop';
import floorWord from '@src/modules/common/READING/words/floor';
import spoonWord from '@src/modules/common/READING/words/spoon';

export let words = [
  toWord,
  tooWord,
  zooWord,
  mooWord,
  foodWord,
  footWord,
  goodWord,
  hookWord,
  poolWord,
  coolWord,
  woodWord,
  cookWord,
  loopWord,
  floorWord,
  spoonWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
