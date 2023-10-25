import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import toysWord from '@src/modules/common/READING/words/toys';
import dollWord from '@src/modules/common/READING/words/doll';
import superheroWord from '@src/modules/common/READING/words/superhero';
import crayonsWord from '@src/modules/common/READING/words/crayons';
import robotWord from '@src/modules/common/READING/words/robot';
import scooterWord from '@src/modules/common/READING/words/scooter';
import tricycleWord from '@src/modules/common/READING/words/tricycle';
import bicycleWord from '@src/modules/common/READING/words/bicycle';
import skateboardWord from '@src/modules/common/READING/words/skateboard';
import jigsawWord from '@src/modules/common/READING/words/jigsaw';
import blocksWord from '@src/modules/common/READING/words/blocks';

export default ModuleBuilder({
  variants: [toysWord, dollWord, superheroWord, crayonsWord, robotWord, scooterWord, tricycleWord, bicycleWord, skateboardWord, jigsawWord, blocksWord],
});
