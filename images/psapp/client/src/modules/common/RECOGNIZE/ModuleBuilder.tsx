import React from 'react';
import {ModuleBuilder as ChoiceModuleBuilder, ChoiceItem} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {
  pickFromBag,
  shuffle,
  PRONUNCIATIONS,
  ProbabilisticDeck
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
  return <ChoiceModuleBuilder
    vlist={new ProbabilisticDeck(
      variants.map(v => ({ variant: v, millicards: 2000 })),
      2000
    )}
    generateChoices={(variant) => {
      if (useAllVariantsAsChoices) {
        return [...variants];
      } else {
        const others = pickFromBag(variants.filter(x => x !== variant), 5, {
          withReplacement: false,
        });
        const allChoices = [...others, variant];
        shuffle(allChoices);
        return allChoices;
      }
    }}
    playInstructions={async (exercise, cancelRef) => {
      let pronunciation: string;
      if (getPronunciation) {
        pronunciation = getPronunciation(exercise.variant);
      } else if (PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS]) {
        pronunciation = PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS];
      } else {
        pronunciation = exercise.variant;
      }
      const moduleContext = React.useContext(ModuleContext);
      await moduleContext.playTTS(`${instructionPrefix} ${pronunciation}`, { cancelRef });
    }}
    isCorrectChoice={(choice, exercise) => {
      return choice === exercise.variant;
    }}
    getFill={(choice, exercise, partial, alreadyFailed) => {
      if (alreadyFailed && choice === exercise.variant) {
        return 'wrong';
      }
      return 'white';
    }}
    initialPartial={() => [] as ChoiceItem[]}
    howManyPerRow={howManyPerRow}
    playOnEveryExercise={true}
  />;
};