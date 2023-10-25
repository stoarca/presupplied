import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import writeWord from '@src/modules/common/READING/words/write';
import wroteWord from '@src/modules/common/READING/words/wrote';
import wrapWord from '@src/modules/common/READING/words/wrap';
import wrinkleWord from '@src/modules/common/READING/words/wrinkle';
import wrongWord from '@src/modules/common/READING/words/wrong';
import wreckWord from '@src/modules/common/READING/words/wreck';
import wrestleWord from '@src/modules/common/READING/words/wrestle';
import wreathWord from '@src/modules/common/READING/words/wreath';

export default ModuleBuilder({
  variants: [writeWord, wroteWord, wrapWord, wrinkleWord, wrongWord, wreckWord, wrestleWord, wreathWord],
});

