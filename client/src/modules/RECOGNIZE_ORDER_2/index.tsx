import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `Tap the ${n0}. Then tap the ${n1}.`,
  (n0, n1) => `After tapping the ${n0}, tap the ${n1}.`,
  (n0, n1) => `First, tap the ${n0}. After that, tap the ${n1}.`,
  (n0, n1) => `Tap the ${n1}, but only after tapping the ${n0}.`,
  (n0, n1) => `Before tapping the ${n1}, tap the ${n0}`,
  (n0, n1) => `Tap the ${n0} before tapping the ${n1}.`,
  (n0, n1) => `Tap the ${n1}, but before that, tap the ${n0}.`,
  (n0, n1) => `First, tap the ${n0}. Next, tap the ${n1}.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n1} should be tapped second.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n1} should be tapped second.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n0} should be tapped first.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n0} should be tapped first.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n1} should be tapped last.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n1} should be tapped last.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 3,
});
