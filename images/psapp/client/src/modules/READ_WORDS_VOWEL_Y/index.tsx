import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import skyWord from '@src/modules/common/READING/words/sky';
import flyWord from '@src/modules/common/READING/words/fly';
import myWord from '@src/modules/common/READING/words/my';
import byWord from '@src/modules/common/READING/words/by';
import tryWord from '@src/modules/common/READING/words/try';
import cryWord from '@src/modules/common/READING/words/cry';
import fryWord from '@src/modules/common/READING/words/fry';
import anyWord from '@src/modules/common/READING/words/any';
import armyWord from '@src/modules/common/READING/words/army';
import applyWord from '@src/modules/common/READING/words/apply';
import babyWord from '@src/modules/common/READING/words/baby';

export default ModuleBuilder({
  variants: [skyWord, flyWord, myWord, byWord, tryWord, cryWord, fryWord, anyWord, armyWord, applyWord, babyWord],
});
