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
  display?: string | { imageUrl: string },
}

interface ModuleBuilderProps<T> {
  variants: readonly T[],
  generateChoices: (variant: T, allVariants: readonly T[]) => ChoiceItem[],
  getInstruction: (exercise: MyEx<T>) => string,
  isCorrectChoice: (choice: ChoiceItem, exercise: MyEx<T>) => boolean,
  getDisplay?: (exercise: MyEx<T>) => string | { imageUrl: string },
  getHighlightedChoice?: (exercise: MyEx<T>) => ChoiceItem,
  allowMultipleSelections?: boolean,
  getAllCorrectChoices?: (exercise: MyEx<T>) => ChoiceItem[],
  howManyPerRow?: number,
  position?: 'center' | 'bottom',
  maxScorePerVariant?: number,
  playOnEveryExercise?: boolean,
  waitForInstructions?: boolean,
}

export let ModuleBuilder = <T, >({
  variants,
  generateChoices,
  getInstruction,
  isCorrectChoice,
  getDisplay,
  getHighlightedChoice,
  allowMultipleSelections = false,
  getAllCorrectChoices,
  howManyPerRow = 5,
  position = 'center',
  maxScorePerVariant = 2000,
  playOnEveryExercise = true,
  waitForInstructions = true,
}: ModuleBuilderProps<T>) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new ProbabilisticDeck(
      variants.map(v => ({ variant: v, millicards: maxScorePerVariant })),
      maxScorePerVariant
    ), []);

    let generateExercise = React.useCallback((): MyEx<T> => {
      let variant = vlist.pickVariant();
      let choices = generateChoices(variant, variants);

      const exercise: MyEx<T> = {
        variant: variant,
        choices: choices,
      };

      if (getDisplay) {
        exercise.display = getDisplay(exercise);
      }

      return exercise;
    }, [vlist]);

    let playInstructions = React.useCallback(async (exercise: MyEx<T>) => {
      const instruction = getInstruction(exercise);
      if (waitForInstructions) {
        await moduleContext.playTTS(instruction);
      } else {
        moduleContext.playTTS(instruction);
      }
    }, [moduleContext, waitForInstructions]);

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
      initialPartial: () => [] as ChoiceItem[],
      onPlayInstructions: playInstructions,
      playOnEveryExercise: playOnEveryExercise,
      vlist: vlist,
    });

    let handleSelected = React.useCallback(async (index: number) => {
      const selectedChoice = exercise.choices[index];

      if (allowMultipleSelections) {
        const currentPartial = partial as ChoiceItem[];

        if (currentPartial.includes(selectedChoice)) {
          const {youAlreadyDidThatOne} = await import('@modules/common/sounds');
          moduleContext.playAudio(youAlreadyDidThatOne);
          return;
        }

        if (!isCorrectChoice(selectedChoice, exercise)) {
          doFailure();
          return;
        }

        const newPartial = [...currentPartial, selectedChoice];
        const allCorrect = getAllCorrectChoices ? getAllCorrectChoices(exercise) : [];

        if (newPartial.length === allCorrect.length) {
          await doPartialSuccess(newPartial);
          doSuccess();
        } else {
          doPartialSuccess(newPartial);
        }
      } else if (isCorrectChoice(selectedChoice, exercise)) {
        const newPartial = [selectedChoice];
        await doPartialSuccess(newPartial);
        doSuccess();
      } else {
        doFailure();
      }
    }, [exercise, partial, doSuccess, doPartialSuccess, doFailure, allowMultipleSelections, getAllCorrectChoices]);

    let getFill = React.useCallback((choice: ChoiceItem) => {
      const highlightedChoice = getHighlightedChoice ? getHighlightedChoice(exercise) : null;

      if (allowMultipleSelections) {
        const currentPartial = partial as ChoiceItem[];

        if (currentPartial.includes(choice)) {
          return '#00ff0033';
        }

        if (alreadyFailed && isCorrectChoice(choice, exercise)) {
          return '#ff000033';
        }
      } else if (isCorrectChoice(choice, exercise)) {
        if (partial.includes(choice)) {
          return '#00ff0033';
        }
        if (alreadyFailed) {
          return '#ff000033';
        }
      }

      if (highlightedChoice !== null && choice === highlightedChoice) {
        return '#0000ff33';
      }

      return 'white';
    }, [exercise, partial, alreadyFailed, getHighlightedChoice, allowMultipleSelections]);

    const renderDisplay = () => {
      if (!exercise.display) {
        return null;
      }

      if (typeof exercise.display === 'string') {
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
            {exercise.display}
          </text>
        );
      } else if (typeof exercise.display === 'object' && 'imageUrl' in exercise.display) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        const size = 200;

        return (
          <image
            href={exercise.display.imageUrl}
            x={centerX - size / 2}
            y={centerY - size / 2}
            width={size}
            height={size}
          />
        );
      }

      return null;
    };

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {renderDisplay()}
        <ChoiceSelector
          choices={exercise.choices}
          howManyPerRow={howManyPerRow}
          getFill={getFill}
          onSelected={handleSelected}
          position={position}
        />
      </Module>
    );
  };
};