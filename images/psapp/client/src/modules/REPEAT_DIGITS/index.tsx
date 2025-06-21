import {ModuleBuilder} from '@modules/common/REPEAT/ModuleBuilder';
import {DIGITS} from '@src/modules/common/READING/util';

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export default ModuleBuilder({
  variants: digits,
  maxScorePerVariant: 3,
  getAudio: (exercise) => DIGITS[exercise.variant],
});
