import { ModuleBuilder } from '@src/modules/common/SOUND_TO_SPELLING_CHOICE/ModuleBuilder';

const variants = [
  'aShortAt',
  'aShortAre',
  'aShortAnd',
  'aLong',
  'b',
  'd',
  'eShort',
  'eLong',
  'f',
  'gHard',
  'h',
  'iShort',
  'iLong',
] as const;

export default ModuleBuilder({ variants });