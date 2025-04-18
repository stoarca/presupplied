import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import betWord from '@src/modules/common/READING/words/bet';
import setWord from '@src/modules/common/READING/words/set';
import letWord from '@src/modules/common/READING/words/let';
import metWord from '@src/modules/common/READING/words/met';
import fedWord from '@src/modules/common/READING/words/fed';
import ledWord from '@src/modules/common/READING/words/led';
import tellWord from '@src/modules/common/READING/words/tell';
import bellWord from '@src/modules/common/READING/words/bell';
import wellWord from '@src/modules/common/READING/words/well';
import bedWord from '@src/modules/common/READING/words/bed';
import sellWord from '@src/modules/common/READING/words/sell';
import fellWord from '@src/modules/common/READING/words/fell';

export let words = [
  betWord,
  setWord,
  letWord,
  metWord,
  fedWord,
  ledWord,
  tellWord,
  bellWord,
  wellWord,
  bedWord,
  sellWord,
  fellWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
