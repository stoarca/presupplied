import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `Tap the ${n0}. After that, tap the ${n1}.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
});
