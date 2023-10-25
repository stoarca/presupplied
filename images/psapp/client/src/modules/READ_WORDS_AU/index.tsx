import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import auntWord from '@src/modules/common/READING/words/aunt';
import authorWord from '@src/modules/common/READING/words/author';
import autoWord from '@src/modules/common/READING/words/auto';
import automaticWord from '@src/modules/common/READING/words/automatic';
import haulWord from '@src/modules/common/READING/words/haul';
import sausageWord from '@src/modules/common/READING/words/sausage';
import paulWord from '@src/modules/common/READING/words/Paul';
import dinosaurWord from '@src/modules/common/READING/words/dinosaur';
import beautifulWord from '@src/modules/common/READING/words/beautiful';
import vaultWord from '@src/modules/common/READING/words/vault';

export default ModuleBuilder({
  variants: [auntWord, autoWord, automaticWord, haulWord, sausageWord, paulWord, dinosaurWord, beautifulWord, vaultWord],
});

