import React from 'react';
import { ModuleBuilder as ChoiceModuleBuilder, MyEx, ChoiceItem } from '@modules/common/CHOICE/ModuleBuilder';
import { ProbabilisticDeck } from '@src/util';
import { ModuleContext } from '@src/ModuleContext';

export type Variant = [number, number];

export interface VariantWithMillicards {
  variant: Variant;
  millicards: number;
}

export type Operation = 'add' | 'subtract';

interface ModuleBuilderProps {
  variants: readonly VariantWithMillicards[],
  maxMillicardsPerVariant: number,
  operation: Operation,
}

export let ModuleBuilder = ({
  variants, maxMillicardsPerVariant, operation
}: ModuleBuilderProps) => {
  return (props: void) => {
    const [highlightedPart, setHighlightedPart] = React.useState<'first' | 'operator' | 'second' | 'equals' | null>(null);
    const moduleContext = React.useContext(ModuleContext);

    const vlist = React.useMemo(
      () => new ProbabilisticDeck(variants, maxMillicardsPerVariant),
      [variants, maxMillicardsPerVariant]
    );

    const operatorSymbol = operation === 'add' ? '+' : '-';

    const playInstructions = React.useCallback((exercise: MyEx<Variant>, cancelRef: { cancelled: boolean }) => {
      (async () => {
        if (cancelRef?.cancelled) {
          return;
        }
        await moduleContext.playTTS('What does', { cancelRef });
        await new Promise(resolve => setTimeout(resolve, 100));

        if (cancelRef?.cancelled) {
          setHighlightedPart(null);
          return;
        }
        setHighlightedPart('first');
        await moduleContext.playTTS(`${exercise.variant[0]}`, { cancelRef });
        await new Promise(resolve => setTimeout(resolve, 100));

        if (cancelRef?.cancelled) {
          setHighlightedPart(null);
          return;
        }
        setHighlightedPart('operator');
        await moduleContext.playTTS(operation === 'add' ? 'plus' : 'minus', { cancelRef });
        await new Promise(resolve => setTimeout(resolve, 100));

        if (cancelRef?.cancelled) {
          setHighlightedPart(null);
          return;
        }
        setHighlightedPart('second');
        await moduleContext.playTTS(`${exercise.variant[1]}`, { cancelRef });
        await new Promise(resolve => setTimeout(resolve, 100));

        if (cancelRef?.cancelled) {
          setHighlightedPart(null);
          return;
        }
        setHighlightedPart('equals');
        await moduleContext.playTTS('equal?', { cancelRef });

        if (cancelRef?.cancelled) {
          setHighlightedPart(null);
          return;
        }
        setHighlightedPart(null);
      })();
    }, [operation, moduleContext]);

    const generateChoices = React.useCallback(() => {
      return Array.from({ length: 10 }, (_, i) => i);
    }, []);


    const isCorrectChoice = React.useCallback((choice: ChoiceItem, exercise: MyEx<Variant>, currentPartial?: number | null) => {
      if (typeof choice !== 'number') {
        return false;
      }

      // Build what the new partial would be if this choice was selected
      const selectedNumber = choice as number;
      const currentValue = currentPartial === null || currentPartial === undefined ? 0 : currentPartial;
      const newPartial = currentValue * 10 + selectedNumber;

      // Check if this new partial would be valid
      const correctAnswer = operation === 'add'
        ? exercise.variant[0] + exercise.variant[1]
        : exercise.variant[0] - exercise.variant[1];

      const newValueStr = newPartial.toString();
      const correctAnswerStr = correctAnswer.toString();

      if (newValueStr.length > correctAnswerStr.length) {
        return false;
      }

      return correctAnswerStr.startsWith(newValueStr);
    }, [operation]);

    const getDisplay = React.useCallback((exercise: MyEx<Variant>, partial: number | null) => {
      const displayValue = partial === null ? '?' : partial;

      return (
        <text
          x={window.innerWidth / 2}
          y={window.innerHeight / 3}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'sans-serif',
            fontSize: '64px',
          }}>
          <tspan fill={highlightedPart === 'first' ? 'red' : 'black'}>
            {exercise.variant[0]}
          </tspan>
          <tspan fill={highlightedPart === 'operator' ? 'red' : 'black'}> {operatorSymbol} </tspan>
          <tspan fill={highlightedPart === 'second' ? 'red' : 'black'}>
            {exercise.variant[1]}
          </tspan>
          <tspan fill={highlightedPart === 'equals' ? 'red' : 'black'}> = </tspan>
          {displayValue}
        </text>
      );
    }, [highlightedPart, operatorSymbol]);

    const initialPartial = React.useCallback(() => null as number | null, []);

    const buildPartialAnswer = React.useCallback((currentPartial: number | null, selectedChoice: ChoiceItem, exercise: MyEx<Variant>) => {
      const selectedNumber = selectedChoice as number;
      const currentValue = currentPartial === null ? 0 : currentPartial;
      return currentValue * 10 + selectedNumber;
    }, []);

    const isPartialComplete = React.useCallback((partial: number | null, exercise: MyEx<Variant>) => {
      const correctAnswer = operation === 'add'
        ? exercise.variant[0] + exercise.variant[1]
        : exercise.variant[0] - exercise.variant[1];

      if (partial === null) {
        return false;
      }

      const newValueStr = partial.toString();
      const correctAnswerStr = correctAnswer.toString();

      return newValueStr.length === correctAnswerStr.length && partial === correctAnswer;
    }, [operation]);

    const isPartialValid = React.useCallback((partial: number | null, exercise: MyEx<Variant>) => {
      const correctAnswer = operation === 'add'
        ? exercise.variant[0] + exercise.variant[1]
        : exercise.variant[0] - exercise.variant[1];

      if (partial === null) {
        return true;
      }

      const newValueStr = partial.toString();
      const correctAnswerStr = correctAnswer.toString();

      if (newValueStr.length > correctAnswerStr.length) {
        return false;
      }

      return correctAnswerStr.startsWith(newValueStr);
    }, [operation]);

    const getFill = React.useCallback((choice: ChoiceItem, exercise: MyEx<Variant>, partial: number | null, alreadyFailed: boolean) => {
      const currentValue = partial || 0;
      const lastDigit = currentValue % 10;

      if (currentValue > 0 && choice === lastDigit) {
        return 'correct';
      }

      if (alreadyFailed && isCorrectChoice(choice, exercise, partial)) {
        return 'wrong';
      }

      return 'white';
    }, [isCorrectChoice]);

    return <ChoiceModuleBuilder
      vlist={vlist}
      generateChoices={generateChoices}
      playInstructions={playInstructions}
      isCorrectChoice={isCorrectChoice}
      getDisplay={getDisplay}
      getFill={getFill}
      initialPartial={initialPartial}
      buildPartialAnswer={buildPartialAnswer}
      isPartialComplete={isPartialComplete}
      isPartialValid={isPartialValid}
      howManyPerRow={10}
      playOnEveryExercise={true}
    />;
  };
};
