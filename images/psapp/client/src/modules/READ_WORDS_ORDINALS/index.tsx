import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import firstWord from '@src/modules/common/READING/words/first';
import secondWord from '@src/modules/common/READING/words/second';
import thirdWord from '@src/modules/common/READING/words/third';
import fourthWord from '@src/modules/common/READING/words/fourth';
import fifthWord from '@src/modules/common/READING/words/fifth';
import sixthWord from '@src/modules/common/READING/words/sixth';
import seventhWord from '@src/modules/common/READING/words/seventh';
import eighthWord from '@src/modules/common/READING/words/eighth';
import ninthWord from '@src/modules/common/READING/words/ninth';
import tenthWord from '@src/modules/common/READING/words/tenth';
import eleventhWord from '@src/modules/common/READING/words/eleventh';
import twelfthWord from '@src/modules/common/READING/words/twelfth';
import thirteenthWord from '@src/modules/common/READING/words/thirteenth';

export let words = [
  firstWord,
  secondWord,
  thirdWord,
  fourthWord,
  fifthWord,
  sixthWord,
  seventhWord,
  eighthWord,
  ninthWord,
  tenthWord,
  eleventhWord,
  twelfthWord,
  thirteenthWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

