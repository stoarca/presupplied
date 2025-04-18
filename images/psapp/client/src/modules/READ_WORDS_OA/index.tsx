import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import oakWord from '@src/modules/common/READING/words/oak';
import oarWord from '@src/modules/common/READING/words/oar';
import roadWord from '@src/modules/common/READING/words/road';
import goalWord from '@src/modules/common/READING/words/goal';
import boatWord from '@src/modules/common/READING/words/boat';
import soapWord from '@src/modules/common/READING/words/soap';
import toadWord from '@src/modules/common/READING/words/toad';
import oatsWord from '@src/modules/common/READING/words/oats';
import floatWord from '@src/modules/common/READING/words/float';
import toastWord from '@src/modules/common/READING/words/toast';
import coastWord from '@src/modules/common/READING/words/coast';

export let words = [
  oakWord,
  oarWord,
  roadWord,
  goalWord,
  boatWord,
  soapWord,
  toadWord,
  oatsWord,
  floatWord,
  toastWord,
  coastWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
