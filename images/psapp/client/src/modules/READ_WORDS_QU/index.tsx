import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import equalWord from '@src/modules/common/READING/words/equal';
import quackWord from '@src/modules/common/READING/words/quack';
import quarterWord from '@src/modules/common/READING/words/quarter';
import queenWord from '@src/modules/common/READING/words/queen';
import quickWord from '@src/modules/common/READING/words/quick';
import quietWord from '@src/modules/common/READING/words/quiet';
import quiteWord from '@src/modules/common/READING/words/quite';
import quitWord from '@src/modules/common/READING/words/quit';
import squashWord from '@src/modules/common/READING/words/squash';
import squeakWord from '@src/modules/common/READING/words/squeak';
import squirtWord from '@src/modules/common/READING/words/squirt';
import squishWord from '@src/modules/common/READING/words/squish';

export let words = [
  equalWord,
  quackWord,
  quarterWord,
  queenWord,
  quickWord,
  quietWord,
  quiteWord,
  quitWord,
  squashWord,
  squeakWord,
  squirtWord,
  squishWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

