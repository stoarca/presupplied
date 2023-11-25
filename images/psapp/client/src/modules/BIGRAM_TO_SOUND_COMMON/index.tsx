import React from 'react';
import {
  ModuleBuilder, Variant
} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import {BIGRAM_SOUNDS, LETTER_SOUNDS} from '@src/modules/common/READING/util';

const BIGRAM_MAPPINGS = {
  'th': 'thThis',
  'ch': 'ch',
  'sh': 'sh',
  'ph': 'f',
  'ck': 'k',
  'gn': 'n',
  'kn': 'n',
  'wh': 'w',
} as const;

let keys: (keyof typeof BIGRAM_MAPPINGS)[] = Object.keys(BIGRAM_MAPPINGS) as any;
export default (props: never) => {
  let variants = keys.map((x: keyof typeof BIGRAM_MAPPINGS) => {
    let spoken;
    if (BIGRAM_MAPPINGS[x] in BIGRAM_SOUNDS) {
      spoken = BIGRAM_SOUNDS[BIGRAM_MAPPINGS[x] as keyof typeof BIGRAM_SOUNDS];
    } else if (BIGRAM_MAPPINGS[x] in LETTER_SOUNDS) {
      spoken = LETTER_SOUNDS[BIGRAM_MAPPINGS[x] as keyof typeof LETTER_SOUNDS];
    }
    let ret: Variant = {
      word: x,
      sounds: [[0, BIGRAM_MAPPINGS[x]]],
      spoken: spoken,
    };
    return ret;
  });
  return (
    <ModuleBuilder variants={variants} isSingleSound={true}/>
  );
};

