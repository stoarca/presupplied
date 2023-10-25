import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import engineerWord from '@src/modules/common/READING/words/engineer';
import astronautWord from '@src/modules/common/READING/words/astronaut';
import firefighterWord from '@src/modules/common/READING/words/firefighter';
import doctorWord from '@src/modules/common/READING/words/doctor';
import painterWord from '@src/modules/common/READING/words/painter';
import plumberWord from '@src/modules/common/READING/words/plumber';
import driverWord from '@src/modules/common/READING/words/driver';
import chefWord from '@src/modules/common/READING/words/chef';
import actorWord from '@src/modules/common/READING/words/actor';
import mechanicWord from '@src/modules/common/READING/words/mechanic';
import accountantWord from '@src/modules/common/READING/words/accountant';
import custodianWord from '@src/modules/common/READING/words/custodian';

export default ModuleBuilder({
  variants: [engineerWord, astronautWord, firefighterWord, doctorWord, painterWord, plumberWord, driverWord, chefWord, actorWord, mechanicWord, accountantWord, custodianWord],
});

