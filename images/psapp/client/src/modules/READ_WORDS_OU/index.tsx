import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import outWord from '@src/modules/common/READING/words/out';
import aboutWord from '@src/modules/common/READING/words/about';
import loudWord from '@src/modules/common/READING/words/loud';
import cloudsWord from '@src/modules/common/READING/words/clouds';
import cougarWord from '@src/modules/common/READING/words/cougar';
import couchWord from '@src/modules/common/READING/words/couch';
import countWord from '@src/modules/common/READING/words/count';
import curiousWord from '@src/modules/common/READING/words/curious';
import foundWord from '@src/modules/common/READING/words/found';
import hourWord from '@src/modules/common/READING/words/hour';
import ourWord from '@src/modules/common/READING/words/our';
import houseWord from '@src/modules/common/READING/words/house';
import doubleWord from '@src/modules/common/READING/words/double';

export let words = [
  outWord,
  aboutWord,
  loudWord,
  cloudsWord,
  cougarWord,
  couchWord,
  countWord,
  curiousWord,
  foundWord,
  hourWord,
  ourWord,
  houseWord,
  doubleWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

