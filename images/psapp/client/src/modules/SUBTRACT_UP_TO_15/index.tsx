import { generateCombinations, getMillicardsForVariant, ModuleBuilder } from '@src/modules/common/SUBTRACT/ModuleBuilder';

const TARGET_MAX = 15;
const combinations = generateCombinations(TARGET_MAX);

const variantsWithMillicards = combinations.map(variant => ({
  variant,
  millicards: getMillicardsForVariant(variant, TARGET_MAX)
}));

export default ModuleBuilder({
  variants: variantsWithMillicards,
  maxMillicardsPerVariant: 6000,
});