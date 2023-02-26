import {
  Variant, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let VARIANTS: Variant[] = [
  'onebefore'
];

export default ModuleBuilder({
  variants: VARIANTS,
  numNumbers: 6,
  maxScorePerVariant: 15,
});


