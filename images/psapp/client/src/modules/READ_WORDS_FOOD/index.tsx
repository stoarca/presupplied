import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import pizzaWord from '@src/modules/common/READING/words/pizza';
import pastaWord from '@src/modules/common/READING/words/pasta';
import milkWord from '@src/modules/common/READING/words/milk';
import meatWord from '@src/modules/common/READING/words/meat';
import salamiWord from '@src/modules/common/READING/words/salami';
import breadWord from '@src/modules/common/READING/words/bread';
import fruitsWord from '@src/modules/common/READING/words/fruits';
import vegetablesWord from '@src/modules/common/READING/words/vegetables';
import beefWord from '@src/modules/common/READING/words/beef';
import baguetteWord from '@src/modules/common/READING/words/baguette';
import oatmealWord from '@src/modules/common/READING/words/oatmeal';
import yogurtWord from '@src/modules/common/READING/words/yogurt';

export default ModuleBuilder({
  variants: [pizzaWord, pastaWord, milkWord, meatWord, salamiWord, breadWord, fruitsWord, vegetablesWord, beefWord, baguetteWord, oatmealWord, yogurtWord],
});

