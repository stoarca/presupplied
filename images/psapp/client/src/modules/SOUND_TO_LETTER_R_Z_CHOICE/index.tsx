import { ModuleBuilder } from '@src/modules/common/SOUND_TO_SPELLING_CHOICE/ModuleBuilder';

const variants = [
  'r',
  's',
  't',
  'uShortDuck',
  'uShortFull',
  'uShortCurious',
  'uLongMute',
  'uLongBlue',
  'v',
  'w',
  'x',
  'yConsonant',
  'z',
  'schwa',
] as const;

export default ModuleBuilder({ variants });