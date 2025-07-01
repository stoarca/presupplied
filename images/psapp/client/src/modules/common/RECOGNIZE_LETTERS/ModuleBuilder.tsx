import React from 'react';
import {ModuleBuilder as ChoiceModuleBuilder, ChoiceItem} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {
  pickFromBag,
  shuffle,
  PRONUNCIATIONS,
  ProbabilisticDeck
} from '@src/util';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

export type Variant = typeof letters[number];

interface ModuleBuilderProps {
  variants: readonly Variant[],
};

export let ModuleBuilder = ({variants}: ModuleBuilderProps) => {
  const moduleContext = React.useContext(ModuleContext);

  return <ChoiceModuleBuilder
    vlist={new ProbabilisticDeck(
      variants.map(v => ({ variant: v, millicards: 2000 })),
      2000
    )}
    generateChoices={(variant) => {
      const others = pickFromBag(variants.filter(x => x !== variant), 5, {
        withReplacement: false,
      });
      const allChoices = [...others, variant];
      shuffle(allChoices);
      return allChoices;
    }}
    playInstructions={async (exercise, cancelRef) => {
      let pronunciation: string;
      if (PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS]) {
        pronunciation = PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS];
      } else {
        pronunciation = exercise.variant;
      }
      await moduleContext.playTTS(`Which letter is ${pronunciation}`, { cancelRef });
    }}
    isCorrectChoice={(choice, exercise) => {
      return choice === exercise.variant;
    }}
    getFill={(choice, exercise, partial, alreadyFailed) => {
      if (partial && partial.length > 0 && choice === exercise.variant) {
        return 'correct';
      }
      if (alreadyFailed && choice === exercise.variant) {
        return 'wrong';
      }
      return 'white';
    }}
    initialPartial={() => [] as ChoiceItem[]}
    howManyPerRow={6}
    playOnEveryExercise={true}
  />;
};

