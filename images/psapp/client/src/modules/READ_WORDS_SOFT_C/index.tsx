import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import ceilingWord from '@src/modules/common/READING/words/ceiling';
import receiveWord from '@src/modules/common/READING/words/receive';
import iceWord from '@src/modules/common/READING/words/ice';
import exerciseWord from '@src/modules/common/READING/words/exercise';
import celeryWord from '@src/modules/common/READING/words/celery';
import circleWord from '@src/modules/common/READING/words/circle';
import cancelWord from '@src/modules/common/READING/words/cancel';
import recipeWord from '@src/modules/common/READING/words/recipe';
import fancyWord from '@src/modules/common/READING/words/fancy';

export let words = [
  ceilingWord,
  receiveWord,
  iceWord,
  exerciseWord,
  celeryWord,
  circleWord,
  cancelWord,
  recipeWord,
  fancyWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
