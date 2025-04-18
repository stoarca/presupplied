import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import andWord from '@src/modules/common/READING/words/and';
import sandWord from '@src/modules/common/READING/words/sand';
import bandWord from '@src/modules/common/READING/words/band';
import landWord from '@src/modules/common/READING/words/land';
import canWord from '@src/modules/common/READING/words/can';
import manWord from '@src/modules/common/READING/words/man';
import fanWord from '@src/modules/common/READING/words/fan';
import panWord from '@src/modules/common/READING/words/pan';
import ranWord from '@src/modules/common/READING/words/ran';
import jamWord from '@src/modules/common/READING/words/jam';
import nagWord from '@src/modules/common/READING/words/nag';
import tanWord from '@src/modules/common/READING/words/tan';

export let words = [
  andWord,
  sandWord,
  bandWord,
  landWord,
  canWord,
  manWord,
  fanWord,
  panWord,
  ranWord,
  jamWord,
  nagWord,
  tanWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
