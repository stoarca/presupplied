import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import useWord from '@src/modules/common/READING/words/use';
import loseWord from '@src/modules/common/READING/words/lose';
import kidsWord from '@src/modules/common/READING/words/kids';
import dogsWord from '@src/modules/common/READING/words/dogs';
import cansWord from '@src/modules/common/READING/words/cans';
import busesWord from '@src/modules/common/READING/words/buses';
import skisWord from '@src/modules/common/READING/words/skis';
import doesWord from '@src/modules/common/READING/words/does';
import goesWord from '@src/modules/common/READING/words/goes';
import potatoesWord from '@src/modules/common/READING/words/potatoes';
import chooseWord from '@src/modules/common/READING/words/choose';
import cheeseWord from '@src/modules/common/READING/words/cheese';
import pleaseWord from '@src/modules/common/READING/words/please';

export let words = [
  useWord,
  loseWord,
  kidsWord,
  dogsWord,
  cansWord,
  busesWord,
  skisWord,
  doesWord,
  goesWord,
  potatoesWord,
  chooseWord,
  cheeseWord,
  pleaseWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

