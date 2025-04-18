import {
  Variant, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let VARIANTS: Variant[] = [
  ['onebefore', () => 1],
  ['onebefore', () => 2],
  ['onebefore', () => 3],
  ['onebefore', () => 4],
  ['onebefore', () => 5],
];

export default ModuleBuilder({
  variants: VARIANTS,
  numNumbers: 6,
  maxScorePerVariant: 5,
});


