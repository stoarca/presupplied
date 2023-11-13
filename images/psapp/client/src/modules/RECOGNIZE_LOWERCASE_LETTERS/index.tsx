import React from 'react';

import {
  Variant, ModuleBuilder
} from '@modules/common/RECOGNIZE_LETTERS/ModuleBuilder';

const VARIANTS: readonly Variant[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] as const;

export default ModuleBuilder({
  variants: VARIANTS,
});
