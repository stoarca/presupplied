import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import binWord from '@src/modules/common/READING/words/bin';
import sitWord from '@src/modules/common/READING/words/sit';
import litWord from '@src/modules/common/READING/words/lit';
import didWord from '@src/modules/common/READING/words/did';
import hidWord from '@src/modules/common/READING/words/hid';
import kidWord from '@src/modules/common/READING/words/kid';
import lidWord from '@src/modules/common/READING/words/lid';
import pigWord from '@src/modules/common/READING/words/pig';
import bigWord from '@src/modules/common/READING/words/big';
import digWord from '@src/modules/common/READING/words/dig';
import himWord from '@src/modules/common/READING/words/him';
import ripWord from '@src/modules/common/READING/words/rip';
import sipWord from '@src/modules/common/READING/words/sip';
import mixWord from '@src/modules/common/READING/words/mix';

export let words = [
  binWord,
  sitWord,
  litWord,
  didWord,
  hidWord,
  kidWord,
  lidWord,
  pigWord,
  bigWord,
  digWord,
  himWord,
  ripWord,
  sipWord,
  mixWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
