import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import fishWord from '@src/modules/common/READING/words/fish';
import walrusWord from '@src/modules/common/READING/words/walrus';
import sealWord from '@src/modules/common/READING/words/seal';
import whaleWord from '@src/modules/common/READING/words/whale';
import starfishWord from '@src/modules/common/READING/words/starfish';
import jellyfishWord from '@src/modules/common/READING/words/jellyfish';
import dolphinWord from '@src/modules/common/READING/words/dolphin';
import sharkWord from '@src/modules/common/READING/words/shark';
import otterWord from '@src/modules/common/READING/words/otter';
import crabWord from '@src/modules/common/READING/words/crab';
import penguinWord from '@src/modules/common/READING/words/penguin';
import seahorseWord from '@src/modules/common/READING/words/seahorse';

export let words = [
  fishWord,
  walrusWord,
  sealWord,
  whaleWord,
  starfishWord,
  jellyfishWord,
  dolphinWord,
  sharkWord,
  otterWord,
  crabWord,
  penguinWord,
  seahorseWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

