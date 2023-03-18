import {
  Variant, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let VARIANTS: Variant[] = [
  ['onebefore', () => 1],
  ['onebefore', () => 2],
  ['onebefore', () => 3],
  ['onebefore', () => 4],
  ['onebefore', () => 5],
  ['onebefore', () => 6],
  ['onebefore', () => 7],
  ['onebefore', () => 8],
  ['onebefore', () => 9],
  ['onebefore', () => 10],
  ['oneafter', () => 0],
  ['oneafter', () => 1],
  ['oneafter', () => 2],
  ['oneafter', () => 3],
  ['oneafter', () => 4],
  ['oneafter', () => 5],
  ['oneafter', () => 6],
  ['oneafter', () => 7],
  ['oneafter', () => 8],
  ['oneafter', () => 9],
];

export default ModuleBuilder({
  variants: VARIANTS,
  numNumbers: 11,
  maxScorePerVariant: 3,
});


