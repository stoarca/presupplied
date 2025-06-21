import {ModuleBuilder as CommonModuleBuilder} from '@modules/common/RECOGNIZE/ModuleBuilder';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

export type Variant = typeof letters[number];

interface ModuleBuilderProps {
  variants: readonly Variant[],
};

export let ModuleBuilder = ({variants}: ModuleBuilderProps) => {
  return CommonModuleBuilder({
    variants: variants,
    useAllVariantsAsChoices: false,
    howManyPerRow: 6,
    instructionPrefix: 'Which letter is'
  });
};

