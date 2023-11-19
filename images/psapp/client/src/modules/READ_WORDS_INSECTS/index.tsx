import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import antWord from '@src/modules/common/READING/words/ant';
import bugWord from '@src/modules/common/READING/words/bug';
import beetleWord from '@src/modules/common/READING/words/beetle';
import butterflyWord from '@src/modules/common/READING/words/butterfly';
import beeWord from '@src/modules/common/READING/words/bee';
import cockroachWord from '@src/modules/common/READING/words/cockroach';
import dragonflyWord from '@src/modules/common/READING/words/dragonfly';
import waspWord from '@src/modules/common/READING/words/wasp';
import caterpillarWord from '@src/modules/common/READING/words/caterpillar';
import ladybugWord from '@src/modules/common/READING/words/ladybug';
import mothWord from '@src/modules/common/READING/words/moth';
import cricketWord from '@src/modules/common/READING/words/cricket';
import grasshopperWord from '@src/modules/common/READING/words/grasshopper';

export let words = [
  antWord,
  bugWord,
  beetleWord,
  butterflyWord,
  beeWord,
  cockroachWord,
  dragonflyWord,
  waspWord,
  caterpillarWord,
  ladybugWord,
  mothWord,
  cricketWord,
  grasshopperWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

