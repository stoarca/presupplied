import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `Tap the ${n0} before tapping the ${n1}.`,
  (n0, n1) => `Before tapping the ${n1}, tap the ${n0}`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
});
