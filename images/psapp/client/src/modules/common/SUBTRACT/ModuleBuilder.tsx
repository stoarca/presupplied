import { ModuleBuilder as ArithmeticModuleBuilder, Variant, VariantWithMillicards } from '@src/modules/common/ARITHMETIC/ModuleBuilder';

export type { Variant, VariantWithMillicards };

export const generateCombinations = (maxNum: number): Variant[] => {
  const combinations: Variant[] = [];
  for (let minuend = 0; minuend <= maxNum; minuend++) {
    for (let subtrahend = 0; subtrahend <= minuend; subtrahend++) {
      combinations.push([minuend, subtrahend]);
    }
  }
  return combinations;
};

export const getMillicardsForVariant = (variant: Variant, targetMax: number): number => {
  const [minuend] = variant;

  if (minuend === targetMax) { return 3000; }
  if (minuend === targetMax - 1) { return 2000; }
  if (minuend === targetMax - 2) { return 1000; }
  if (minuend === targetMax - 3) { return 500; }
  if (minuend >= targetMax - 6 && minuend <= targetMax - 4) { return 100; }
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
    operation: 'subtract'
  });
};