import { ModuleBuilder } from '@src/modules/common/SOUND_TO_SPELLING_CHOICE/ModuleBuilder';

const variants = [
  'j',
  'k',
  'l',
  'm',
  'n',
  'oShortOut',
  'oShortMom',
  'oLongGo',
  'oLongMore',
  'p',
  'q',
] as const;

export default ModuleBuilder({ variants });