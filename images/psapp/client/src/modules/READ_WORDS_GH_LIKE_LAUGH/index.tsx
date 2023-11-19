import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import laughWord from '@src/modules/common/READING/words/laugh';
import roughWord from '@src/modules/common/READING/words/rough';
import toughWord from '@src/modules/common/READING/words/tough';
import coughWord from '@src/modules/common/READING/words/cough';
import enoughWord from '@src/modules/common/READING/words/enough';
import droughtWord from '@src/modules/common/READING/words/drought';

export let words = [laughWord, roughWord, toughWord, coughWord, enoughWord, droughtWord];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

