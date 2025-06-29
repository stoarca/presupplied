import {ModuleBuilder, Variant} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

const VARIANTS: Variant[] = [
  ['onebefore', 1],
  ['onebefore', 2],
  ['onebefore', 3],
  ['onebefore', 4],
  ['onebefore', 5],
];

export default ModuleBuilder({
  variants: VARIANTS.map(v => ({ variant: v, millicards: 5000 })),
  maxMillicardsPerVariant: 5000,
  generateChoices: () => [0, 1, 2, 3, 4, 5],
  howManyPerRow: 6,
});


