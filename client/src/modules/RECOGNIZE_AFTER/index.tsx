import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  //(n0, n1) => `After tapping the ${n0}, tap the ${n1}.`,
  (n0, n1) => `Tap the ${n1} after tapping the ${n0}.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
});
