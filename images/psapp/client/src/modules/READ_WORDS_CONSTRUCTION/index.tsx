import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import buildingWord from '@src/modules/common/READING/words/building';
import craneWord from '@src/modules/common/READING/words/crane';
import cementWord from '@src/modules/common/READING/words/cement';
import asphaltWord from '@src/modules/common/READING/words/asphalt';
import repairWord from '@src/modules/common/READING/words/repair';
import renovationWord from '@src/modules/common/READING/words/renovation';
import bridgeWord from '@src/modules/common/READING/words/bridge';
import tunnelWord from '@src/modules/common/READING/words/tunnel';
import demolitionWord from '@src/modules/common/READING/words/demolition';
import constructionWord from '@src/modules/common/READING/words/construction';

export default ModuleBuilder({
  variants: [buildingWord, craneWord, cementWord, asphaltWord, repairWord, renovationWord, bridgeWord, tunnelWord, demolitionWord, constructionWord],
});

