import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tieWord from '@src/modules/common/READING/words/tie';
import dieWord from '@src/modules/common/READING/words/die';
import lieWord from '@src/modules/common/READING/words/lie';
import pieWord from '@src/modules/common/READING/words/pie';
import viewWord from '@src/modules/common/READING/words/view';
import fieldWord from '@src/modules/common/READING/words/field';
import briefWord from '@src/modules/common/READING/words/brief';
import movieWord from '@src/modules/common/READING/words/movie';
import genieWord from '@src/modules/common/READING/words/genie';
import friendWord from '@src/modules/common/READING/words/friend';
import alienWord from '@src/modules/common/READING/words/alien';

export default ModuleBuilder({
  variants: [tieWord, dieWord, lieWord, pieWord, viewWord, fieldWord, briefWord, movieWord, genieWord, friendWord, alienWord],
});
