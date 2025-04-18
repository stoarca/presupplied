import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import gymWord from '@src/modules/common/READING/words/gym';
import gemWord from '@src/modules/common/READING/words/gem';
import germWord from '@src/modules/common/READING/words/germ';
import gingerWord from '@src/modules/common/READING/words/ginger';
import gelWord from '@src/modules/common/READING/words/gel';
import generalWord from '@src/modules/common/READING/words/general';
import largeWord from '@src/modules/common/READING/words/large';
import angelWord from '@src/modules/common/READING/words/angel';
import ageWord from '@src/modules/common/READING/words/age';
import logicWord from '@src/modules/common/READING/words/logic';
import legendWord from '@src/modules/common/READING/words/legend';

export let words = [
  gymWord,
  gemWord,
  germWord,
  gingerWord,
  gelWord,
  generalWord,
  largeWord,
  angelWord,
  ageWord,
  logicWord,
  legendWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
