import {ModuleBuilder as ChoiceModuleBuilder} from '@modules/common/CHOICE/ModuleBuilder';
import {
  pickFromBag,
  shuffle,
  PRONUNCIATIONS
} from '@src/util';

export type Variant = string;

interface ModuleBuilderProps {
  variants: readonly Variant[],
  useAllVariantsAsChoices?: boolean,
  howManyPerRow?: number,
  getPronunciation?: (variant: Variant) => string,
  instructionPrefix?: string,
}

export let ModuleBuilder = ({
  variants,
  useAllVariantsAsChoices = false,
  howManyPerRow = 6,
  getPronunciation,
  instructionPrefix = 'Which one is'
}: ModuleBuilderProps) => {
  return ChoiceModuleBuilder({
    variants,
    generateChoices: (variant, allVariants) => {
      if (useAllVariantsAsChoices) {
        return [...allVariants];
      } else {
        const others = pickFromBag(allVariants.filter(x => x !== variant), 5, {
          withReplacement: false,
        });
        const allChoices = [...others, variant];
        shuffle(allChoices);
        return allChoices;
      }
    },
    getInstruction: (exercise) => {
      let pronunciation: string;
      if (getPronunciation) {
        pronunciation = getPronunciation(exercise.variant);
      } else if (PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS]) {
        pronunciation = PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS];
      } else {
        pronunciation = exercise.variant;
      }
      return `${instructionPrefix} ${pronunciation}`;
    },
    isCorrectChoice: (choice, exercise) => {
      return choice === exercise.variant;
    },
    howManyPerRow,
    playOnEveryExercise: true,
  });
};