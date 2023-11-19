import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import potWord from '@src/modules/common/READING/words/pot';
import dogWord from '@src/modules/common/READING/words/dog';
import hotWord from '@src/modules/common/READING/words/hot';
import topWord from '@src/modules/common/READING/words/top';
import boxWord from '@src/modules/common/READING/words/box';
import mopWord from '@src/modules/common/READING/words/mop';
import hopWord from '@src/modules/common/READING/words/hop';
import someWord from '@src/modules/common/READING/words/some';
import lotWord from '@src/modules/common/READING/words/lot';
import dotWord from '@src/modules/common/READING/words/dot';
import fogWord from '@src/modules/common/READING/words/fog';
import jobWord from '@src/modules/common/READING/words/job';
import popWord from '@src/modules/common/READING/words/pop';

export let words = [
  potWord,
  dogWord,
  hotWord,
  topWord,
  boxWord,
  mopWord,
  hopWord,
  someWord,
  lotWord,
  dotWord,
  fogWord,
  jobWord,
  popWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
