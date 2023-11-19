import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import whatWord from '@src/modules/common/READING/words/what';
import whenWord from '@src/modules/common/READING/words/when';
import whoWord from '@src/modules/common/READING/words/who';
import whyWord from '@src/modules/common/READING/words/why';
import wheelWord from '@src/modules/common/READING/words/wheel';
import whichWord from '@src/modules/common/READING/words/which';
import wholeWord from '@src/modules/common/READING/words/whole';
import holeWord from '@src/modules/common/READING/words/hole';
import whoaWord from '@src/modules/common/READING/words/whoa';
import anywhereWord from '@src/modules/common/READING/words/anywhere';
import somewhereWord from '@src/modules/common/READING/words/somewhere';

export let words = [
  whatWord,
  whenWord,
  whoWord,
  whyWord,
  wheelWord,
  whichWord,
  wholeWord,
  holeWord,
  whoaWord,
  anywhereWord,
  somewhereWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

