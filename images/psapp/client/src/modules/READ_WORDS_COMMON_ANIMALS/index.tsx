import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import monkeyWord from '@src/modules/common/READING/words/monkey';
import horseWord from '@src/modules/common/READING/words/horse';
import duckWord from '@src/modules/common/READING/words/duck';
import chickenWord from '@src/modules/common/READING/words/chicken';
import catWord from '@src/modules/common/READING/words/cat';
import mouseWord from '@src/modules/common/READING/words/mouse';
import birdWord from '@src/modules/common/READING/words/bird';
import snakeWord from '@src/modules/common/READING/words/snake';
import bearWord from '@src/modules/common/READING/words/bear';
import rabbitWord from '@src/modules/common/READING/words/rabbit';

export let words = [
  monkeyWord,
  horseWord,
  duckWord,
  chickenWord,
  catWord,
  mouseWord,
  birdWord,
  snakeWord,
  bearWord,
  rabbitWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

