import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import driveWord from '@src/modules/common/READING/words/drive';
import drinkWord from '@src/modules/common/READING/words/drink';
import bedroomWord from '@src/modules/common/READING/words/bedroom';
import drawWord from '@src/modules/common/READING/words/draw';
import dreamWord from '@src/modules/common/READING/words/dream';
import dropWord from '@src/modules/common/READING/words/drop';
import drumWord from '@src/modules/common/READING/words/drum';
import dressWord from '@src/modules/common/READING/words/dress';
import addressWord from '@src/modules/common/READING/words/address';
import screwdriverWord from '@src/modules/common/READING/words/screwdriver';
import dragonWord from '@src/modules/common/READING/words/dragon';

export let words = [
  driveWord,
  drinkWord,
  bedroomWord,
  drawWord,
  dreamWord,
  dropWord,
  drumWord,
  dressWord,
  addressWord,
  screwdriverWord,
  dragonWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

