import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import talkWord from '@src/modules/common/READING/words/talk';
import walkWord from '@src/modules/common/READING/words/walk';
import milkWord from '@src/modules/common/READING/words/milk';
import yolkWord from '@src/modules/common/READING/words/yolk';
import bulkyWord from '@src/modules/common/READING/words/bulky';
import folksWord from '@src/modules/common/READING/words/folks';
import hulkWord from '@src/modules/common/READING/words/hulk';
import elkWord from '@src/modules/common/READING/words/elk';
import silkWord from '@src/modules/common/READING/words/silk';

export let words = [
  talkWord,
  walkWord,
  milkWord,
  yolkWord,
  bulkyWord,
  folksWord,
  hulkWord,
  elkWord,
  silkWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

