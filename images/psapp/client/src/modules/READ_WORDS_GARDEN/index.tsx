import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import flowersWord from '@src/modules/common/READING/words/flowers';
import gardenWord from '@src/modules/common/READING/words/garden';
import bushesWord from '@src/modules/common/READING/words/bushes';
import roseWord from '@src/modules/common/READING/words/rose';
import birdfeederWord from '@src/modules/common/READING/words/birdfeeder';
import backyardWord from '@src/modules/common/READING/words/backyard';
import treesWord from '@src/modules/common/READING/words/trees';
import patioWord from '@src/modules/common/READING/words/patio';
import soilWord from '@src/modules/common/READING/words/soil';
import flowerbedWord from '@src/modules/common/READING/words/flowerbed';
import plantsWord from '@src/modules/common/READING/words/plants';
import grassWord from '@src/modules/common/READING/words/grass';

export default ModuleBuilder({
  variants: [flowersWord, gardenWord, bushesWord, roseWord, birdfeederWord, backyardWord, treesWord, patioWord, soilWord, flowerbedWord, plantsWord, grassWord],
});

