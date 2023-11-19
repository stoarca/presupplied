import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import sapWord from '@src/modules/common/READING/words/sap';
import setWord from '@src/modules/common/READING/words/set';
import napsWord from '@src/modules/common/READING/words/naps';
import stemWord from '@src/modules/common/READING/words/stem';
import attacksWord from '@src/modules/common/READING/words/attacks';
import cooksWord from '@src/modules/common/READING/words/cooks';
import weeksWord from '@src/modules/common/READING/words/weeks';
import clapsWord from '@src/modules/common/READING/words/claps';
import bootsWord from '@src/modules/common/READING/words/boots';
import eatsWord from '@src/modules/common/READING/words/eats';
import bathsWord from '@src/modules/common/READING/words/baths';
import birthsWord from '@src/modules/common/READING/words/births';

export let words = [
  sapWord,
  setWord,
  napsWord,
  stemWord,
  attacksWord,
  cooksWord,
  weeksWord,
  clapsWord,
  bootsWord,
  eatsWord,
  bathsWord,
  birthsWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

