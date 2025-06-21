import {ModuleBuilder as CommonModuleBuilder} from '@modules/common/REPEAT/ModuleBuilder';
import {LETTERS} from '@src/modules/common/READING/util';


export type Variant = keyof typeof LETTERS;

interface ModuleBuilderProps {
  variants: readonly Variant[],
  maxScorePerVariant: number,
}

export let ModuleBuilder = ({
  variants, maxScorePerVariant
}: ModuleBuilderProps) => {
  return CommonModuleBuilder({
    variants: variants,
    maxScorePerVariant: maxScorePerVariant,
    getAudio: (exercise) => LETTERS[exercise.variant],
    displayText: (exercise) => `${exercise.variant.toUpperCase()} ${exercise.variant}`,
  });
};
