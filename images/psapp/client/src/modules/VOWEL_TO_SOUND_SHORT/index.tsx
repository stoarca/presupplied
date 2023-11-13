import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import {LETTER_SOUNDS} from '@src/modules/common/READING/util';

const LETTER_MAPPINGS: Record<string, keyof typeof LETTER_SOUNDS> = {
  'a': 'aShortAt',
  'e': 'eShort',
  'i': 'iShort',
  'o': 'oShortMom',
  'u': 'uShortDuck',
} as const;

export default ModuleBuilder({
  variants: Object.keys(LETTER_MAPPINGS).map((x: keyof typeof LETTER_MAPPINGS) => {
    return {
      word: x,
      sounds: [[0, LETTER_MAPPINGS[x]]],
      spoken: LETTER_SOUNDS[LETTER_MAPPINGS[x]],
    };
  }),
  isSingleSound: true,
});

