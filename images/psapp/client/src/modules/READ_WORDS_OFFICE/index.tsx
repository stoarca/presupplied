import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import officeWord from '@src/modules/common/READING/words/office';
import deskWord from '@src/modules/common/READING/words/desk';
import jobWord from '@src/modules/common/READING/words/job';
import workWord from '@src/modules/common/READING/words/work';
import productWord from '@src/modules/common/READING/words/product';
import serviceWord from '@src/modules/common/READING/words/service';
import businessWord from '@src/modules/common/READING/words/business';
import startupWord from '@src/modules/common/READING/words/startup';
import employeeWord from '@src/modules/common/READING/words/employee';
import employerWord from '@src/modules/common/READING/words/employer';

export let words = [
  officeWord,
  deskWord,
  jobWord,
  workWord,
  productWord,
  serviceWord,
  businessWord,
  startupWord,
  employeeWord,
  employerWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

