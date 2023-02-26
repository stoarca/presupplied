import {
  Variant, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let VARIANTS: Variant[] = [
  'allbefore', 'onebefore', 'previous', 'allafter', 'oneafter', 'next'
];

export default ModuleBuilder({
  variants: VARIANTS,
  numNumbers: 11,
  maxScorePerVariant: 5,
});


