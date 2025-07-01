import React from 'react';
import {ModuleBuilder as ChoiceModuleBuilder, ChoiceItem} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {
  PRONUNCIATIONS,
  ProbabilisticDeck
} from '@src/util';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export default function RecognizeDigitsModule() {
  const moduleContext = React.useContext(ModuleContext);

  return <ChoiceModuleBuilder
    vlist={new ProbabilisticDeck(
      DIGITS.map(v => ({ variant: v, millicards: 2000 })),
      2000
    )}
    generateChoices={(variant) => {
      return [...DIGITS];
    }}
    playInstructions={async (exercise, cancelRef) => {
      let pronunciation: string;
      if (PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS]) {
        pronunciation = PRONUNCIATIONS[exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS];
      } else {
        pronunciation = exercise.variant;
      }
      await moduleContext.playTTS(`Which digit is ${pronunciation}`, { cancelRef });
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
    howManyPerRow={10}
    playOnEveryExercise={true}
  />;
}