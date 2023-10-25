import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import beingWord from '@src/modules/common/READING/words/being';
import veilWord from '@src/modules/common/READING/words/veil';
import veinsWord from '@src/modules/common/READING/words/veins';
import heirsWord from '@src/modules/common/READING/words/heirs';
import weirdWord from '@src/modules/common/READING/words/weird';
import seizeWord from '@src/modules/common/READING/words/seize';
import heistWord from '@src/modules/common/READING/words/heist';

export default ModuleBuilder({
  variants: [beingWord, veilWord, veinsWord, heirsWord, weirdWord, seizeWord, heistWord],
});
