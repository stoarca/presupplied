import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import bedroomWord from '@src/modules/common/READING/words/bedroom';
import blanketWord from '@src/modules/common/READING/words/blanket';
import closetWord from '@src/modules/common/READING/words/closet';
import cribWord from '@src/modules/common/READING/words/crib';
import drawerWord from '@src/modules/common/READING/words/drawer';
import dresserWord from '@src/modules/common/READING/words/dresser';
import pillowWord from '@src/modules/common/READING/words/pillow';
import lampWord from '@src/modules/common/READING/words/lamp';
import curtainWord from '@src/modules/common/READING/words/curtain';
import chairWord from '@src/modules/common/READING/words/chair';
import deskWord from '@src/modules/common/READING/words/desk';

export default ModuleBuilder({
  variants: [bedroomWord, blanketWord, closetWord, cribWord, drawerWord, dresserWord, pillowWord, lampWord, curtainWord, chairWord, deskWord],
});

