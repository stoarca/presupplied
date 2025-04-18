import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import awakeWord from '@src/modules/common/READING/words/awake';
import awayWord from '@src/modules/common/READING/words/away';
import awfulWord from '@src/modules/common/READING/words/awful';
import aweWord from '@src/modules/common/READING/words/awe';
import clawsWord from '@src/modules/common/READING/words/claws';
import lawnWord from '@src/modules/common/READING/words/lawn';
import strawberryWord from '@src/modules/common/READING/words/strawberry';
import lawsWord from '@src/modules/common/READING/words/laws';
import awesomeWord from '@src/modules/common/READING/words/awesome';
import crawlWord from '@src/modules/common/READING/words/crawl';
import lawyerWord from '@src/modules/common/READING/words/lawyer';

export let words = [
  awakeWord,
  awayWord,
  awfulWord,
  aweWord,
  clawsWord,
  lawnWord,
  strawberryWord,
  lawsWord,
  awesomeWord,
  crawlWord,
  lawyerWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
