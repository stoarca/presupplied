import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import ovenWord from '@src/modules/common/READING/words/oven';
import fridgeWord from '@src/modules/common/READING/words/fridge';
import freezerWord from '@src/modules/common/READING/words/freezer';
import cupboardWord from '@src/modules/common/READING/words/cupboard';
import counterWord from '@src/modules/common/READING/words/counter';
import stoveWord from '@src/modules/common/READING/words/stove';
import toasterWord from '@src/modules/common/READING/words/toaster';
import kettleWord from '@src/modules/common/READING/words/kettle';
import spoonWord from '@src/modules/common/READING/words/spoon';
import forkWord from '@src/modules/common/READING/words/fork';
import plateWord from '@src/modules/common/READING/words/plate';
import bowlWord from '@src/modules/common/READING/words/bowl';

export default ModuleBuilder({
  variants: [ovenWord, fridgeWord, freezerWord, cupboardWord, counterWord, stoveWord, toasterWord, kettleWord, spoonWord, forkWord, plateWord, bowlWord],
});

