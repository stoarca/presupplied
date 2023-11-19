import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import areWord from '@src/modules/common/READING/words/are';
import allWord from '@src/modules/common/READING/words/all';
import ballWord from '@src/modules/common/READING/words/ball';
import callWord from '@src/modules/common/READING/words/call';
import wallWord from '@src/modules/common/READING/words/wall';
import fallWord from '@src/modules/common/READING/words/fall';
import farWord from '@src/modules/common/READING/words/far';
import carWord from '@src/modules/common/READING/words/car';
import barWord from '@src/modules/common/READING/words/bar';
import mallWord from '@src/modules/common/READING/words/mall';
import starWord from '@src/modules/common/READING/words/star';

export let words = [
  areWord,
  allWord,
  ballWord,
  callWord,
  wallWord,
  fallWord,
  farWord,
  carWord,
  barWord,
  mallWord,
  starWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
