import {ModuleBuilder, Variant} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

const VARIANTS: Variant[] = [
  ['oneafter', 0],
  ['oneafter', 1],
  ['oneafter', 2],
  ['oneafter', 3],
  ['oneafter', 4],
];

export default ModuleBuilder({
  variants: VARIANTS.map(v => ({ variant: v, millicards: 5000 })),
  maxMillicardsPerVariant: 5000,
  generateChoices: () => [0, 1, 2, 3, 4, 5],
  howManyPerRow: 6,
});


