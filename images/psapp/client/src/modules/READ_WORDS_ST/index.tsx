import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import bestWord from '@src/modules/common/READING/words/best';
import fastWord from '@src/modules/common/READING/words/fast';
import listWord from '@src/modules/common/READING/words/list';
import pastWord from '@src/modules/common/READING/words/past';
import restWord from '@src/modules/common/READING/words/rest';
import testWord from '@src/modules/common/READING/words/test';
import justWord from '@src/modules/common/READING/words/just';
import lastWord from '@src/modules/common/READING/words/last';
import rustWord from '@src/modules/common/READING/words/rust';
import dustWord from '@src/modules/common/READING/words/dust';
import stepWord from '@src/modules/common/READING/words/step';
import stillWord from '@src/modules/common/READING/words/still';
import stingWord from '@src/modules/common/READING/words/sting';
import stopWord from '@src/modules/common/READING/words/stop';

export default ModuleBuilder({
  variants: [bestWord, fastWord, listWord, pastWord, restWord, testWord, justWord, lastWord, rustWord, dustWord, stepWord, stillWord, stingWord, stopWord],
});
