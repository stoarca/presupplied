import React from 'react';
import {
  Variant, ModuleBuilder
} from '@modules/common/RECOGNIZE_LETTERS/ModuleBuilder';

const VARIANTS: readonly Variant[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

export default function RecognizeUppercaseLettersModule() {
  return <ModuleBuilder variants={VARIANTS} />;
}
