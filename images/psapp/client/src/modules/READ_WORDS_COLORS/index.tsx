import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import redWord from '@src/modules/common/READING/words/red';
import blueWord from '@src/modules/common/READING/words/blue';
import orangeWord from '@src/modules/common/READING/words/orange';
import greenWord from '@src/modules/common/READING/words/green';
import violetWord from '@src/modules/common/READING/words/violet';
import purpleWord from '@src/modules/common/READING/words/purple';
import yellowWord from '@src/modules/common/READING/words/yellow';
import brownWord from '@src/modules/common/READING/words/brown';
import blackWord from '@src/modules/common/READING/words/black';
import whiteWord from '@src/modules/common/READING/words/white';
import grayWord from '@src/modules/common/READING/words/gray';
import pinkWord from '@src/modules/common/READING/words/pink';

export default ModuleBuilder({
  variants: [redWord, blueWord, orangeWord, greenWord, violetWord, purpleWord, yellowWord, brownWord, blackWord, whiteWord, grayWord, pinkWord],
});

