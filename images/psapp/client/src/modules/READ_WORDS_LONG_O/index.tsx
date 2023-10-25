import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import goWord from '@src/modules/common/READING/words/go';
import noWord from '@src/modules/common/READING/words/no';
import soWord from '@src/modules/common/READING/words/so';
import toeWord from '@src/modules/common/READING/words/toe';
import moreWord from '@src/modules/common/READING/words/more';
import soreWord from '@src/modules/common/READING/words/sore';
import fortWord from '@src/modules/common/READING/words/fort';
import snowWord from '@src/modules/common/READING/words/snow';
import belowWord from '@src/modules/common/READING/words/below';
import forkWord from '@src/modules/common/READING/words/fork';
import helloWord from '@src/modules/common/READING/words/hello';

export default ModuleBuilder({
  variants: [goWord, noWord, soWord, toeWord, moreWord, soreWord, fortWord, snowWord, belowWord, forkWord, helloWord],
});
