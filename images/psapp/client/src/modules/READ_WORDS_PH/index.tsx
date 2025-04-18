import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import alphabetWord from '@src/modules/common/READING/words/alphabet';
import elephantWord from '@src/modules/common/READING/words/elephant';
import pharmacyWord from '@src/modules/common/READING/words/pharmacy';
import phoneWord from '@src/modules/common/READING/words/phone';
import photographWord from '@src/modules/common/READING/words/photograph';
import photosWord from '@src/modules/common/READING/words/photos';
import sphereWord from '@src/modules/common/READING/words/sphere';
import microphoneWord from '@src/modules/common/READING/words/microphone';
import dolphinWord from '@src/modules/common/READING/words/dolphin';

export let words = [
  alphabetWord,
  elephantWord,
  pharmacyWord,
  phoneWord,
  photographWord,
  photosWord,
  sphereWord,
  microphoneWord,
  dolphinWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

