import { generateCombinations, getMillicardsForVariant, ModuleBuilder } from '@src/modules/common/ADD/ModuleBuilder';

const TARGET_SUM = 9;
const combinations = generateCombinations(TARGET_SUM);

const variantsWithMillicards = combinations.map(variant => ({
  variant,
  millicards: getMillicardsForVariant(variant, TARGET_SUM)
}));

export default ModuleBuilder({
  variants: variantsWithMillicards,
  maxMillicardsPerVariant: 6000,
});