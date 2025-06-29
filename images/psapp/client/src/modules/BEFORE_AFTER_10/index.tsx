import {ModuleBuilder, Variant} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

const VARIANTS: Variant[] = [
  // Before variants (1-10)
  ['onebefore', 1],
  ['onebefore', 2],
  ['onebefore', 3],
  ['onebefore', 4],
  ['onebefore', 5],
  ['onebefore', 6],
  ['onebefore', 7],
  ['onebefore', 8],
  ['onebefore', 9],
  ['onebefore', 10],
  // After variants (0-9)
  ['oneafter', 0],
  ['oneafter', 1],
  ['oneafter', 2],
  ['oneafter', 3],
  ['oneafter', 4],
  ['oneafter', 5],
  ['oneafter', 6],
  ['oneafter', 7],
  ['oneafter', 8],
  ['oneafter', 9],
];

export default ModuleBuilder({
  variants: VARIANTS.map(v => ({ variant: v, millicards: 3000 })),
  maxMillicardsPerVariant: 3000,
  generateChoices: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  howManyPerRow: 10,
});


