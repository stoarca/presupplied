import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import oneWord from '@src/modules/common/READING/words/one';
import twoWord from '@src/modules/common/READING/words/two';
import threeWord from '@src/modules/common/READING/words/three';
import fourWord from '@src/modules/common/READING/words/four';
import fiveWord from '@src/modules/common/READING/words/five';
import sixWord from '@src/modules/common/READING/words/six';
import sevenWord from '@src/modules/common/READING/words/seven';
import eightWord from '@src/modules/common/READING/words/eight';
import nineWord from '@src/modules/common/READING/words/nine';
import tenWord from '@src/modules/common/READING/words/ten';
import elevenWord from '@src/modules/common/READING/words/eleven';
import twelveWord from '@src/modules/common/READING/words/twelve';
import thirteenWord from '@src/modules/common/READING/words/thirteen';

export default ModuleBuilder({
  variants: [oneWord, twoWord, threeWord, fourWord, fiveWord, sixWord, sevenWord, eightWord, nineWord, tenWord, elevenWord, twelveWord, thirteenWord],
});

