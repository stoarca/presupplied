import React from 'react';
import { useExercise, Ex, Module } from '@src/Module';
import { ModuleContext } from '@src/ModuleContext';
import { ProbabilisticDeck } from '@src/util';
import { ChoiceSelector } from '@src/ChoiceSelector';

export type Variant = [number, number];

interface MyEx extends Ex<Variant> {
}

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

    const [highlightedPart, setHighlightedPart] = React.useState<'first' | 'operator' | 'second' | 'equals' | null>(null);

    const playInstructions = React.useCallback((exercise: MyEx) => {
      (async () => {
        await moduleContext.playTTS('What does');
        await new Promise(resolve => setTimeout(resolve, 100));

        setHighlightedPart('first');
        await moduleContext.playTTS(`${exercise.variant[0]}`);
        await new Promise(resolve => setTimeout(resolve, 100));

        setHighlightedPart('operator');
        await moduleContext.playTTS(operation === 'add' ? 'plus' : 'minus');
        await new Promise(resolve => setTimeout(resolve, 100));

        setHighlightedPart('second');
        await moduleContext.playTTS(`${exercise.variant[1]}`);
        await new Promise(resolve => setTimeout(resolve, 100));

        setHighlightedPart('equals');
        await moduleContext.playTTS('equal?');

        setHighlightedPart(null);
      })();
    }, [moduleContext, operation]);

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
      const correctAnswer = operation === 'add'
        ? exercise.variant[0] + exercise.variant[1]
        : exercise.variant[0] - exercise.variant[1];

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
    }, [exercise, doSuccess, doPartialSuccess, doFailure, choices, partial, operation]);

    let getFill = React.useCallback((choiceIndex: number) => {
      if (partial !== null && choiceIndex === partial % 10) {
        return '#00ff0033';
      }
      return 'white';
    }, [partial]);

    const displayValue = partial === null ? '?' : partial;
    const operatorSymbol = operation === 'add' ? '+' : '-';

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
          <tspan fill={highlightedPart === 'operator' ? 'red' : 'black'}> {operatorSymbol} </tspan>
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