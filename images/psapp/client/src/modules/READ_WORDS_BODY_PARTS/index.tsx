import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import armsWord from '@src/modules/common/READING/words/arms';
import legsWord from '@src/modules/common/READING/words/legs';
import shouldersWord from '@src/modules/common/READING/words/shoulders';
import headWord from '@src/modules/common/READING/words/head';
import hairWord from '@src/modules/common/READING/words/hair';
import feetWord from '@src/modules/common/READING/words/feet';
import elbowsWord from '@src/modules/common/READING/words/elbows';
import kneesWord from '@src/modules/common/READING/words/knees';
import anklesWord from '@src/modules/common/READING/words/ankles';
import eyesWord from '@src/modules/common/READING/words/eyes';
import noseWord from '@src/modules/common/READING/words/nose';
import mouthWord from '@src/modules/common/READING/words/mouth';
import earsWord from '@src/modules/common/READING/words/ears';

export default ModuleBuilder({
  variants: [armsWord, legsWord, shouldersWord, headWord, hairWord, feetWord, elbowsWord, kneesWord, anklesWord, eyesWord, noseWord, mouthWord, earsWord],
});

