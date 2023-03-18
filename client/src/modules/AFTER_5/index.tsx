import {
  Variant, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let VARIANTS: Variant[] = [
  ['oneafter', () => 0],
  ['oneafter', () => 1],
  ['oneafter', () => 2],
  ['oneafter', () => 3],
  ['oneafter', () => 4],
];

export default ModuleBuilder({
  variants: VARIANTS,
  numNumbers: 6,
  maxScorePerVariant: 5,
});


