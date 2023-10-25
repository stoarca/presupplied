import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import willWord from '@src/modules/common/READING/words/will';
import hillWord from '@src/modules/common/READING/words/hill';
import dullWord from '@src/modules/common/READING/words/dull';
import tallWord from '@src/modules/common/READING/words/tall';
import smellWord from '@src/modules/common/READING/words/smell';
import allowWord from '@src/modules/common/READING/words/allow';
import dollarWord from '@src/modules/common/READING/words/dollar';
import fellowWord from '@src/modules/common/READING/words/fellow';
import followWord from '@src/modules/common/READING/words/follow';
import millionWord from '@src/modules/common/READING/words/million';

export default ModuleBuilder({
  variants: [willWord, hillWord, dullWord, tallWord, smellWord, allowWord, dollarWord, fellowWord, followWord, millionWord],
});

