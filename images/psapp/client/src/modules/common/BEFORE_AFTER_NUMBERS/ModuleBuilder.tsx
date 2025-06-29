import React from 'react';
import {ModuleBuilder as ChoiceModuleBuilder, MyEx as ChoiceEx, ChoiceItem} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';

export type Type =
    'allbefore' | 'onebefore' | 'previous' | 'allafter' | 'oneafter' | 'next';

export type Variant = [Type, number];

export interface MyEx extends ChoiceEx<Variant> {
}

interface VariantWithMillicards {
  variant: Variant;
  millicards: number;
}

interface ModuleBuilderProps {
  variants: readonly VariantWithMillicards[];
  maxMillicardsPerVariant: number;
  generateChoices: () => ChoiceItem[];
  howManyPerRow?: number;
}

export let exerciseToSentence = (exercise: MyEx) => {
  const number = exercise.variant[1];
  if (exercise.variant[0] === 'allbefore') {
    return `Tap all the numbers that come before ${number}.`;
  } else if (exercise.variant[0] === 'onebefore') {
    return `Tap the number that comes before ${number}.`;
  } else if (exercise.variant[0] === 'previous') {
    return `We're at ${number}. Tap the previous number.`;
  } else if (exercise.variant[0] === 'allafter') {
    return `Tap all the numbers that come after ${number}.`;
  } else if (exercise.variant[0] === 'oneafter') {
    return `Tap the number that comes after ${number}.`;
  } else if (exercise.variant[0] === 'next') {
    return `We're at ${number}. Tap the next number.`;
  } else {
    let exhaustiveCheck: never = exercise.variant[0]; // eslint-disable-line no-unused-vars
    throw new Error('exerciseToSentence unknown variant ' + exercise.variant);
  }
};

export let isCorrectChoice = (choice: ChoiceItem, exercise: MyEx): boolean => {
  const type = exercise.variant[0];
  const number = exercise.variant[1];

  if (typeof choice !== 'number') {
    return false;
  }

  if (['allbefore', 'onebefore', 'previous'].includes(type)) {
    if (type === 'allbefore') {
      return choice < number;
    } else {
      return choice === number - 1;
    }
  } else if (type === 'allafter') {
    return choice > number;
  } else {
    return choice === number + 1;
  }
};

export let ModuleBuilder = ({
  variants,
  maxMillicardsPerVariant,
  generateChoices,
  howManyPerRow = 5
}: ModuleBuilderProps) => {
  return () => {
    const moduleContext = React.useContext(ModuleContext);

    const vlist = React.useMemo(
      () => new ProbabilisticDeck(variants, maxMillicardsPerVariant),
      [variants, maxMillicardsPerVariant]
    );

    const playInstructions = React.useCallback(async (exercise: MyEx, cancelRef: { cancelled: boolean }) => {
      await moduleContext.playTTS(exerciseToSentence(exercise), { cancelRef });
    }, [moduleContext]);

    const initialPartial = React.useCallback(() => [] as ChoiceItem[], []);

    const buildPartialAnswer = React.useCallback((currentPartial: ChoiceItem[], selectedChoice: ChoiceItem, exercise: MyEx) => {
      const currentNumbers = currentPartial as number[];
      const selectedNumber = selectedChoice as number;

      if (currentNumbers.includes(selectedNumber)) {
        return currentPartial;
      }

      return [...currentNumbers, selectedNumber];
    }, []);

    const isPartialComplete = React.useCallback((partial: ChoiceItem[], exercise: MyEx) => {
      const type = exercise.variant[0];
      const number = exercise.variant[1];
      const partialNumbers = partial as number[];

      if (type === 'allbefore') {
        const expectedNumbers: number[] = [];
        for (let i = 0; i < number; i++) {
          expectedNumbers.push(i);
        }
        return expectedNumbers.every(num => partialNumbers.includes(num)) &&
               partialNumbers.every(num => expectedNumbers.includes(num));
      } else if (type === 'allafter') {
        const expectedNumbers: number[] = [];
        for (let i = number + 1; i <= 10; i++) {
          expectedNumbers.push(i);
        }
        return expectedNumbers.every(num => partialNumbers.includes(num)) &&
               partialNumbers.every(num => expectedNumbers.includes(num));
      } else {
        return partialNumbers.length === 1;
      }
    }, []);

    const getFill = React.useCallback((choice: ChoiceItem, exercise: MyEx, partial: ChoiceItem[], alreadyFailed: boolean) => {
      if (typeof choice !== 'number') {
        return 'white';
      }

      const questionNumber = exercise.variant[1];
      const partialNumbers = partial as number[];

      if (partialNumbers.includes(choice)) {
        return 'correct';
      }

      if (choice === questionNumber) {
        return 'focus';
      }

      if (alreadyFailed && isCorrectChoice(choice, exercise)) {
        return 'wrong';
      }

      return 'white';
    }, []);

    return <ChoiceModuleBuilder
      vlist={vlist}
      generateChoices={generateChoices}
      playInstructions={playInstructions}
      isCorrectChoice={isCorrectChoice}
      getFill={getFill}
      initialPartial={initialPartial}
      buildPartialAnswer={buildPartialAnswer}
      isPartialComplete={isPartialComplete}
      howManyPerRow={howManyPerRow}
    />;
  };
};


