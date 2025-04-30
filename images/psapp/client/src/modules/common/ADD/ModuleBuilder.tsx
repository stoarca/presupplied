import React from 'react';
import { useExercise, Ex, Module } from '@src/Module';
import { ModuleContext } from '@src/ModuleContext';
import { ProbabilisticDeck } from '@src/util';
import { ChoiceSelector } from '@src/ChoiceSelector';

export type Variant = [number, number];

interface MyEx extends Ex<Variant> {
}

export const generateCombinations = (maxNum: number, minSum = 0): Variant[] => {
  const combinations: Variant[] = [];
  for (let i = minSum; i <= maxNum; i++) {
    for (let j = 0; j <= maxNum - i; j++) {
      combinations.push([i, j]);
    }
  }
  return combinations;
};

export const getMillicardsForVariant = (variant: Variant, targetSum: number): number => {
  const sum = variant[0] + variant[1];

  if (sum === targetSum) { return 3000; }
  if (sum === targetSum - 1) { return 2000; }
  if (sum === targetSum - 2) { return 1000; }
  if (sum === targetSum - 3) { return 500; }
  if (sum >= targetSum - 6 && sum <= targetSum - 4) { return 100; }
  return 30;
};

export interface VariantWithMillicards {
  variant: Variant;
  millicards: number;
}

interface ModuleBuilderProps {
  variants: readonly VariantWithMillicards[],
  maxMillicardsPerVariant: number,
}

export let ModuleBuilder = ({
  variants, maxMillicardsPerVariant
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new ProbabilisticDeck(variants, maxMillicardsPerVariant),
      [variants, maxMillicardsPerVariant]
    );
    let generateExercise = React.useCallback((): MyEx => {
      let variant = vlist.pickVariant();

      return {
        variant: variant,
      };
    }, [vlist]);

    const [highlightedPart, setHighlightedPart] = React.useState<'first' | 'plus' | 'second' | 'equals' | null>(null);

    const playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playTTS('What does');
      await new Promise(resolve => setTimeout(resolve, 100));

      setHighlightedPart('first');
      await moduleContext.playTTS(`${exercise.variant[0]}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      setHighlightedPart('plus');
      await moduleContext.playTTS('plus');
      await new Promise(resolve => setTimeout(resolve, 100));

      setHighlightedPart('second');
      await moduleContext.playTTS(`${exercise.variant[1]}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      setHighlightedPart('equals');
      await moduleContext.playTTS('equal?');

      setHighlightedPart(null);
      return Promise.resolve();
    }, [moduleContext]);

    let {
      exercise,
      partial,
      score,
      maxScore,
      doSuccess,
      doPartialSuccess,
      doFailure,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): number | null => null,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let choices = React.useMemo(() => {
      return Array.from({ length: 10 }, (_, i) => i);
    }, []);

    let handleSelected = React.useCallback(async (index: number) => {
      let selectedNumber = choices[index];
      const correctAnswer = exercise.variant[0] + exercise.variant[1];

      const currentValue = partial === null ? 0 : partial;
      const newValue = currentValue * 10 + selectedNumber;

      const newValueStr = newValue.toString();
      const correctAnswerStr = correctAnswer.toString();

      if (newValueStr.length === correctAnswerStr.length) {
        if (newValue === correctAnswer) {
          await doPartialSuccess(newValue);
          await doSuccess();
        } else {
          await doFailure();
        }
      } else if (newValueStr.length < correctAnswerStr.length) {
        if (correctAnswerStr.startsWith(newValueStr)) {
          await doPartialSuccess(newValue);
        } else {
          await doFailure();
        }
      } else {
        await doFailure();
      }
    }, [exercise, doSuccess, doPartialSuccess, doFailure, choices, partial]);

    let getFill = React.useCallback((choiceIndex: number) => {
      if (partial !== null && choiceIndex === partial % 10) {
        return '#00ff0033';
      }
      return 'white';
    }, [partial]);

    const displayValue = partial === null ? '?' : partial;

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
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
          <tspan fill={highlightedPart === 'plus' ? 'red' : 'black'}> + </tspan>
          <tspan fill={highlightedPart === 'second' ? 'red' : 'black'}>
            {exercise.variant[1]}
          </tspan>
          <tspan fill={highlightedPart === 'equals' ? 'red' : 'black'}> = </tspan>
          {displayValue}
        </text>
        <ChoiceSelector
          choices={choices}
          howManyPerRow={10}
          getFill={getFill}
          onSelected={handleSelected}
        />
      </Module>
    );
  };
};
