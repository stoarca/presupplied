import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import thisWord from '@src/modules/common/READING/words/this';
import thatWord from '@src/modules/common/READING/words/that';
import thoseWord from '@src/modules/common/READING/words/those';
import theseWord from '@src/modules/common/READING/words/these';
import brotherWord from '@src/modules/common/READING/words/brother';
import motherWord from '@src/modules/common/READING/words/mother';
import otherWord from '@src/modules/common/READING/words/other';
import anotherWord from '@src/modules/common/READING/words/another';
import thereWord from '@src/modules/common/READING/words/there';
import theirWord from '@src/modules/common/READING/words/their';
import theyWord from '@src/modules/common/READING/words/they';
import thenWord from '@src/modules/common/READING/words/then';

export default ModuleBuilder({
  variants: [thisWord, thatWord, thoseWord, theseWord, brotherWord, motherWord, otherWord, anotherWord, thereWord, theirWord, theyWord, thenWord],
});

