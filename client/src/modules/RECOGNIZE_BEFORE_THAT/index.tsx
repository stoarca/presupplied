import {Variant, ModuleBuilder} from '@src/modules/common/BEFORE_AFTER/ModuleBuilder';

let VARIANTS: Variant[] = [
  (n0, n1) => `Tap the ${n1}, but before that, tap the ${n0}.`,
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
});
