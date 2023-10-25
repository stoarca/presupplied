import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import clapWord from '@src/modules/common/READING/words/clap';
import clipWord from '@src/modules/common/READING/words/clip';
import cubeWord from '@src/modules/common/READING/words/cube';
import copeWord from '@src/modules/common/READING/words/cope';
import campWord from '@src/modules/common/READING/words/camp';
import caveWord from '@src/modules/common/READING/words/cave';
import coldWord from '@src/modules/common/READING/words/cold';
import cordWord from '@src/modules/common/READING/words/cord';
import corkWord from '@src/modules/common/READING/words/cork';

export default ModuleBuilder({
  variants: [clapWord, clipWord, cubeWord, copeWord, campWord, caveWord, coldWord, cordWord, corkWord],
});
