import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';

import {youAlreadyDidThatOne} from '@modules/common/sounds';

export type Type =
    'allbefore' | 'onebefore' | 'previous' | 'allafter' | 'oneafter' | 'next';

export type Variant = [Type, () => number];

interface MyEx extends Ex<Variant> {
  number: number,
}

let variantToSentence = (v: Variant, ex: MyEx) => {
  if (v[0] === 'allbefore') {
    return `Tap all the numbers that come before ${ex.number}.`;
  } else if (v[0] === 'onebefore') {
    return `Tap the number that comes before ${ex.number}.`;
  } else if (v[0] === 'previous') {
    return `We're at ${ex.number}. Tap the previous number.`;
  } else if (v[0] === 'allafter') {
    return `Tap all the numbers that come after ${ex.number}.`;
  } else if (v[0] === 'oneafter') {
    return `Tap the number that comes after ${ex.number}.`;
  } else if (v[0] === 'next') {
    return `We're at ${ex.number}. Tap the next number.`;
  } else {
    let exhaustiveCheck: never = v[0]; // eslint-disable-line no-unused-vars
    throw new Error('variantToSentence unknown variant ' + v);
  }
};

interface ModuleBuilderProps {
  variants: Variant[],
  numNumbers: number,
  maxScorePerVariant: number,
}

export let ModuleBuilder = ({
  variants,
  numNumbers,
  maxScorePerVariant,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: maxScorePerVariant * 1000 })), maxScorePerVariant * 1000), []
    );
    let generateExercise = React.useCallback(() => {
      let variant = vlist.pickVariant();
      return {
        variant: variant,
        number: variant[1](),
      };
    }, [vlist]);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      return moduleContext.playTTS(
        variantToSentence(exercise.variant, exercise)
      );
    }, [moduleContext]);
    let {
      exercise,
      partial,
      score,
      maxScore,
      doSuccess,
      doPartialSuccess,
      doFailure
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): number[] => [],
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let handleSelected = React.useCallback(async (index: number) => {
      let number = index;
      if (partial.includes(number)) {
        moduleContext.playAudio(youAlreadyDidThatOne);
        return;
      }

      if (['allbefore', 'onebefore', 'previous'].includes(exercise.variant[0])) {
        if (number >= exercise.number) {
          doFailure();
        } else if (exercise.variant[0] === 'allbefore') {
          let newPartial = [...partial, number];
          if (newPartial.length === exercise.number) {
            await doPartialSuccess(newPartial);
            doSuccess();
          } else {
            doPartialSuccess(newPartial);
          }
        } else if (number === exercise.number - 1) {
          await doPartialSuccess([number]);
          doSuccess();
        } else {
          doFailure();
        }
      } else if (['allafter', 'oneafter', 'next'].includes(exercise.variant[0])) {
        if (number <= exercise.number) {
          doFailure();
        } else if (exercise.variant[0] === 'allafter') {
          let newPartial = [...partial, number];
          await doPartialSuccess(newPartial);
          if (newPartial.length === numNumbers - exercise.number - 1) {
            doSuccess();
          }
        } else if (number === exercise.number + 1) {
          await doPartialSuccess([number]);
          doSuccess();
        } else {
          doFailure();
        }
      } else {
        throw new Error('Unknown variant id ' + exercise.variant);
      }
    }, [
      moduleContext, exercise, partial, doSuccess, doPartialSuccess, doFailure
    ]);

    let getFill = React.useCallback((choiceIndex: number) => {
      let fill = 'white';
      if (choiceIndex === exercise.number) {
        fill = '#0000ff33';
      } else if (partial.includes(choiceIndex)) {
        fill = '#00ff0033';
      }
      return fill;
    }, [exercise, partial]);
    let choicesArr = Array(numNumbers).fill(1).map((x, i) => i);
    console.log(choicesArr);
    let choices = (
      <ChoiceSelector
        choices={choicesArr}
        howManyPerRow={Math.min(numNumbers, 10)}
        getFill={getFill}
        onSelected={handleSelected}/>
    );

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {choices}
      </Module>
    );
  };
};
