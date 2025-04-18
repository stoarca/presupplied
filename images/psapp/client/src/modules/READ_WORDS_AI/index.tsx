import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import airWord from '@src/modules/common/READING/words/air';
import aidWord from '@src/modules/common/READING/words/aid';
import aimWord from '@src/modules/common/READING/words/aim';
import mailWord from '@src/modules/common/READING/words/mail';
import tailWord from '@src/modules/common/READING/words/tail';
import againWord from '@src/modules/common/READING/words/again';
import stairWord from '@src/modules/common/READING/words/stair';
import saidWord from '@src/modules/common/READING/words/said';
import rainWord from '@src/modules/common/READING/words/rain';
import waitWord from '@src/modules/common/READING/words/wait';
import gainWord from '@src/modules/common/READING/words/gain';

export let words = [
  airWord,
  aidWord,
  aimWord,
  mailWord,
  tailWord,
  againWord,
  stairWord,
  saidWord,
  rainWord,
  waitWord,
  gainWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
