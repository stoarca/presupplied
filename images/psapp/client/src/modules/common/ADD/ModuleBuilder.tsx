import { ModuleBuilder as ArithmeticModuleBuilder, Variant, VariantWithMillicards } from '@src/modules/common/ARITHMETIC/ModuleBuilder';

export type { Variant, VariantWithMillicards };

export const generateCombinations = (maxNum: number, minSum = 0): Variant[] => {
  const combinations: Variant[] = [];
  for (let i = minSum; i <= maxNum; i++) {
    for (let j = 0; j <= maxNum - i; j++) {
      combinations.push([i, j]);
    }
  }
  return combinations;
};

export const getMillicardsForVariant = (variant: Variant, targetSum: number): number => {
  const sum = variant[0] + variant[1];

  if (sum === targetSum) { return 3000; }
  if (sum === targetSum - 1) { return 2000; }
  if (sum === targetSum - 2) { return 1000; }
  if (sum === targetSum - 3) { return 500; }
  if (sum >= targetSum - 6 && sum <= targetSum - 4) { return 100; }
  return 30;
};

interface ModuleBuilderProps {
  variants: readonly VariantWithMillicards[],
  maxMillicardsPerVariant: number,
}

export let ModuleBuilder = ({
  variants, maxMillicardsPerVariant
}: ModuleBuilderProps) => {
  return ArithmeticModuleBuilder({
    variants,
    maxMillicardsPerVariant,
    operation: 'add'
  });
};