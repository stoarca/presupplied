import {ModuleBuilder} from '@modules/common/RECOGNIZE/ModuleBuilder';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export default ModuleBuilder({
  variants: DIGITS,
  useAllVariantsAsChoices: true,
  howManyPerRow: 10,
  instructionPrefix: 'Which digit is'
});