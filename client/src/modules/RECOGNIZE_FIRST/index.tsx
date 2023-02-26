import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `First, tap the ${n0}. After that, tap the ${n1}.`,
  (n0, n1) => `First, tap the ${n0}. Next, tap the ${n1}.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n0} should be tapped first.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n0} should be tapped first.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 5,
});
