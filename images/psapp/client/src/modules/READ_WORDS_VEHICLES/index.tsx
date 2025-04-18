import React from 'react';
import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import carWord from '@src/modules/common/READING/words/car';
import motorcycleWord from '@src/modules/common/READING/words/motorcycle';
import truckWord from '@src/modules/common/READING/words/truck';
import airplaneWord from '@src/modules/common/READING/words/airplane';
import boatWord from '@src/modules/common/READING/words/boat';
import submarineWord from '@src/modules/common/READING/words/submarine';
import trainWord from '@src/modules/common/READING/words/train';
import bulldozerWord from '@src/modules/common/READING/words/bulldozer';
import taxiWord from '@src/modules/common/READING/words/taxi';
import busWord from '@src/modules/common/READING/words/bus';
import limousineWord from '@src/modules/common/READING/words/limousine';
import locomotiveWord from '@src/modules/common/READING/words/locomotive';
import rocketWord from '@src/modules/common/READING/words/rocket';
import subwayWord from '@src/modules/common/READING/words/subway';

export let words = [
  carWord,
  motorcycleWord,
  truckWord,
  airplaneWord,
  boatWord,
  submarineWord,
  trainWord,
  bulldozerWord,
  taxiWord,
  busWord,
  limousineWord,
  locomotiveWord,
  rocketWord,
  subwayWord
];

export default (props: never) => {
  return <ModuleBuilder variants={words} />;
};

