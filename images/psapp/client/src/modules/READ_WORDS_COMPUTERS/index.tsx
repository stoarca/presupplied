import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import computerWord from '@src/modules/common/READING/words/computer';
import tabletWord from '@src/modules/common/READING/words/tablet';
import smartphoneWord from '@src/modules/common/READING/words/smartphone';
import applicationWord from '@src/modules/common/READING/words/application';
import mouseWord from '@src/modules/common/READING/words/mouse';
import keyboardWord from '@src/modules/common/READING/words/keyboard';
import screenWord from '@src/modules/common/READING/words/screen';
import monitorWord from '@src/modules/common/READING/words/monitor';
import cablesWord from '@src/modules/common/READING/words/cables';
import graphicsWord from '@src/modules/common/READING/words/graphics';
import displayWord from '@src/modules/common/READING/words/display';
import windowWord from '@src/modules/common/READING/words/window';
import programWord from '@src/modules/common/READING/words/program';

export let words = [
  computerWord,
  tabletWord,
  smartphoneWord,
  applicationWord,
  mouseWord,
  keyboardWord,
  screenWord,
  monitorWord,
  cablesWord,
  graphicsWord,
  displayWord,
  windowWord,
  programWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

