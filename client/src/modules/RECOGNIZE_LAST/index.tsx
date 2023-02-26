import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n1} should be tapped last.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n1} should be tapped last.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
});
