import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import happyWord from '@src/modules/common/READING/words/happy';
import sadWord from '@src/modules/common/READING/words/sad';
import angryWord from '@src/modules/common/READING/words/angry';
import jealousWord from '@src/modules/common/READING/words/jealous';
import proudWord from '@src/modules/common/READING/words/proud';
import excitedWord from '@src/modules/common/READING/words/excited';
import lonelyWord from '@src/modules/common/READING/words/lonely';
import nervousWord from '@src/modules/common/READING/words/nervous';
import scaredWord from '@src/modules/common/READING/words/scared';
import calmWord from '@src/modules/common/READING/words/calm';
import boredWord from '@src/modules/common/READING/words/bored';

export let words = [
  happyWord,
  sadWord,
  angryWord,
  jealousWord,
  proudWord,
  excitedWord,
  lonelyWord,
  nervousWord,
  scaredWord,
  calmWord,
  boredWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

