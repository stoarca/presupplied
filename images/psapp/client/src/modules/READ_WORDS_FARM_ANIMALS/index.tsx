import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import cowWord from '@src/modules/common/READING/words/cow';
import pigWord from '@src/modules/common/READING/words/pig';
import goatWord from '@src/modules/common/READING/words/goat';
import sheepWord from '@src/modules/common/READING/words/sheep';
import donkeyWord from '@src/modules/common/READING/words/donkey';
import chickenWord from '@src/modules/common/READING/words/chicken';
import poultryWord from '@src/modules/common/READING/words/poultry';
import turkeyWord from '@src/modules/common/READING/words/turkey';
import honeybeeWord from '@src/modules/common/READING/words/honeybee';
import gooseWord from '@src/modules/common/READING/words/goose';
import llamaWord from '@src/modules/common/READING/words/llama';

export let words = [
  cowWord,
  pigWord,
  goatWord,
  sheepWord,
  donkeyWord,
  chickenWord,
  poultryWord,
  turkeyWord,
  honeybeeWord,
  gooseWord,
  llamaWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

