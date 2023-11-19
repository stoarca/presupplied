import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import appleWord from '@src/modules/common/READING/words/apple';
import bananaWord from '@src/modules/common/READING/words/banana';
import peachWord from '@src/modules/common/READING/words/peach';
import plumWord from '@src/modules/common/READING/words/plum';
import avocadoWord from '@src/modules/common/READING/words/avocado';
import tangerineWord from '@src/modules/common/READING/words/tangerine';
import orangeWord from '@src/modules/common/READING/words/orange';
import watermelonWord from '@src/modules/common/READING/words/watermelon';
import grapesWord from '@src/modules/common/READING/words/grapes';
import blueberriesWord from '@src/modules/common/READING/words/blueberries';
import pearWord from '@src/modules/common/READING/words/pear';

export let words = [
  appleWord,
  bananaWord,
  peachWord,
  plumWord,
  avocadoWord,
  tangerineWord,
  orangeWord,
  watermelonWord,
  grapesWord,
  blueberriesWord,
  pearWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

