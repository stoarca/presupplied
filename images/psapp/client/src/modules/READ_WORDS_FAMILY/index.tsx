import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import momWord from '@src/modules/common/READING/words/mom';
import dadWord from '@src/modules/common/READING/words/dad';
import brotherWord from '@src/modules/common/READING/words/brother';
import sisterWord from '@src/modules/common/READING/words/sister';
import auntWord from '@src/modules/common/READING/words/aunt';
import uncleWord from '@src/modules/common/READING/words/uncle';
import cousinWord from '@src/modules/common/READING/words/cousin';
import sonWord from '@src/modules/common/READING/words/son';
import daughterWord from '@src/modules/common/READING/words/daughter';
import grandmotherWord from '@src/modules/common/READING/words/grandmother';
import grandfatherWord from '@src/modules/common/READING/words/grandfather';
import grandmaWord from '@src/modules/common/READING/words/grandma';
import grandpaWord from '@src/modules/common/READING/words/grandpa';

export default ModuleBuilder({
  variants: [momWord, dadWord, brotherWord, sisterWord, auntWord, uncleWord, cousinWord, sonWord, daughterWord, grandmotherWord, grandfatherWord, grandmaWord, grandpaWord],
});

