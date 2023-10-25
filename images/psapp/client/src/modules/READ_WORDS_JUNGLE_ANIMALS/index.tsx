import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import tigerWord from '@src/modules/common/READING/words/tiger';
import gorillaWord from '@src/modules/common/READING/words/gorilla';
import elephantWord from '@src/modules/common/READING/words/elephant';
import lionWord from '@src/modules/common/READING/words/lion';
import toucanWord from '@src/modules/common/READING/words/toucan';
import hippoWord from '@src/modules/common/READING/words/hippo';
import slothWord from '@src/modules/common/READING/words/sloth';
import crocodileWord from '@src/modules/common/READING/words/crocodile';
import rhinocerosWord from '@src/modules/common/READING/words/rhinoceros';
import chimpanzeeWord from '@src/modules/common/READING/words/chimpanzee';

export default ModuleBuilder({
  variants: [tigerWord, gorillaWord, elephantWord, lionWord, toucanWord, hippoWord, slothWord, crocodileWord, rhinocerosWord, chimpanzeeWord],
});

