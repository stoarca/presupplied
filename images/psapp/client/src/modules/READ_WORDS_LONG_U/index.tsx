import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tubeWord from '@src/modules/common/READING/words/tube';
import tuneWord from '@src/modules/common/READING/words/tune';
import muteWord from '@src/modules/common/READING/words/mute';
import muleWord from '@src/modules/common/READING/words/mule';
import fluteWord from '@src/modules/common/READING/words/flute';
import pruneWord from '@src/modules/common/READING/words/prune';
import glueWord from '@src/modules/common/READING/words/glue';
import clueWord from '@src/modules/common/READING/words/clue';
import rudeWord from '@src/modules/common/READING/words/rude';
import ruleWord from '@src/modules/common/READING/words/rule';
import trueWord from '@src/modules/common/READING/words/true';

export let words = [
  tubeWord,
  tuneWord,
  muteWord,
  muleWord,
  fluteWord,
  pruneWord,
  glueWord,
  clueWord,
  rudeWord,
  ruleWord,
  trueWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};
