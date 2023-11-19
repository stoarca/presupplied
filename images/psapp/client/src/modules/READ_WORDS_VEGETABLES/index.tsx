import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tomatoWord from '@src/modules/common/READING/words/tomato';
import cucumberWord from '@src/modules/common/READING/words/cucumber';
import eggplantWord from '@src/modules/common/READING/words/eggplant';
import zucchiniWord from '@src/modules/common/READING/words/zucchini';
import pepperWord from '@src/modules/common/READING/words/pepper';
import asparagusWord from '@src/modules/common/READING/words/asparagus';
import onionWord from '@src/modules/common/READING/words/onion';
import garlicWord from '@src/modules/common/READING/words/garlic';
import cabbageWord from '@src/modules/common/READING/words/cabbage';
import cauliflowerWord from '@src/modules/common/READING/words/cauliflower';
import carrotWord from '@src/modules/common/READING/words/carrot';

export let words = [
  tomatoWord,
  cucumberWord,
  eggplantWord,
  zucchiniWord,
  pepperWord,
  asparagusWord,
  onionWord,
  garlicWord,
  cabbageWord,
  cauliflowerWord,
  carrotWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

