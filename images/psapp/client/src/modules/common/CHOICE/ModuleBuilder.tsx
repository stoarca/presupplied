import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {
  ProbabilisticDeck,
} from '@src/util';

export type ChoiceItem = number | string | { imageUrl: string };

export interface MyEx<T> extends Ex<T> {
  choices: ChoiceItem[],
}

interface ModuleBuilderProps<T, P> {
  vlist: ProbabilisticDeck<T>,
  generateChoices: (variant: T) => ChoiceItem[],
  playInstructions: (exercise: MyEx<T>, cancelRef: { cancelled: boolean }) => void | Promise<void>,
  isCorrectChoice: (choice: ChoiceItem, exercise: MyEx<T>, partial?: P) => boolean,
  getDisplay?: (exercise: MyEx<T>, partial: P) => string | { imageUrl: string } | React.ReactNode,
  getFill: (choice: ChoiceItem, exercise: MyEx<T>, partial: P, alreadyFailed: boolean) => 'correct' | 'wrong' | 'focus' | 'white',
  initialPartial: () => P,
  buildPartialAnswer?: (currentPartial: P, selectedChoice: ChoiceItem, exercise: MyEx<T>) => P,
  isPartialComplete?: (partial: P, exercise: MyEx<T>) => boolean,
  isPartialValid?: (partial: P, exercise: MyEx<T>) => boolean,
  howManyPerRow?: number,
  position?: 'center' | 'bottom',
  playOnEveryExercise?: boolean,
}

export let ModuleBuilder = <T, P>({
  vlist,
  generateChoices,
  playInstructions,
  isCorrectChoice,
  getDisplay,
  getFill,
  initialPartial,
  buildPartialAnswer,
  isPartialComplete,
  isPartialValid,
  howManyPerRow = 5,
  position = 'center',
  playOnEveryExercise = true,
}: ModuleBuilderProps<T, P>) => {
  let moduleContext = React.useContext(ModuleContext);


  let generateExercise = React.useCallback((): MyEx<T> => {
    let variant = vlist.pickVariant();
    let choices = generateChoices(variant);

    const exercise: MyEx<T> = {
      variant: variant,
      choices: choices,
    };

    return exercise;
  }, [vlist, generateChoices]);

  let handlePlayInstructions = React.useCallback((exercise: MyEx<T>, cancelRef: { cancelled: boolean }) => {
    return playInstructions(exercise, cancelRef);
  }, [playInstructions]);

  let {
    exercise,
    partial,
    score,
    maxScore,
    doSuccess,
    doPartialSuccess,
    doFailure,
    alreadyFailed,
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: initialPartial,
    onPlayInstructions: handlePlayInstructions,
    playOnEveryExercise: playOnEveryExercise,
    vlist: vlist,
  });

  let handleSelected = React.useCallback(async (index: number) => {
    const selectedChoice = exercise.choices[index];

    if (buildPartialAnswer && isPartialComplete) {
      if (!isCorrectChoice(selectedChoice, exercise, partial)) {
        doFailure();
        return;
      }

      const newPartial = buildPartialAnswer(partial, selectedChoice, exercise);

      if (isPartialValid && !isPartialValid(newPartial, exercise)) {
        doFailure();
        return;
      }

      await doPartialSuccess(newPartial);

      if (isPartialComplete(newPartial, exercise)) {
        doSuccess();
      }
    } else if (isCorrectChoice(selectedChoice, exercise, partial)) {
      const newPartial = [selectedChoice];
      await doPartialSuccess(newPartial as P);
      doSuccess();
    } else {
      doFailure();
    }
  }, [exercise, partial, doSuccess, doPartialSuccess, doFailure, buildPartialAnswer, isPartialComplete, isPartialValid, moduleContext]);

  let getChoiceFill = React.useCallback((choice: ChoiceItem) => {
    const semanticColor = getFill(choice, exercise, partial, alreadyFailed);

    const colorMap = {
      'correct': '#00ff0033',
      'wrong': '#ff000033',
      'focus': '#0000ff33',
      'white': 'white'
    };

    return colorMap[semanticColor];
  }, [exercise, partial, alreadyFailed, getFill]);

  const renderDisplay = () => {
    if (!getDisplay) {
      return null;
    }

    const display = getDisplay(exercise, partial);

    if (typeof display === 'string') {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 3;

      return (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="48"
          fontFamily="sans-serif"
        >
          {display}
        </text>
      );
    } else if (typeof display === 'object' && display !== null && 'imageUrl' in display) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 3;
      const size = 200;

      return (
        <image
          href={(display as { imageUrl: string }).imageUrl}
          x={centerX - size / 2}
          y={centerY - size / 2}
          width={size}
          height={size}
        />
      );
    } else {
      return display as React.ReactNode;
    }
  };

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      {renderDisplay()}
      <ChoiceSelector
        choices={exercise.choices}
        howManyPerRow={howManyPerRow}
        getFill={getChoiceFill}
        onSelected={handleSelected}
        position={position}
      />
    </Module>
  );
};