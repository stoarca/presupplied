import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, pickFromBag, PRONUNCIATIONS, shuffle} from '@src/util';
import {goodDing} from '@modules/common/sounds';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

export type Variant = typeof letters[number];

interface MyEx extends Ex<Variant> {
  choices: Variant[],
}

interface ModuleBuilderProps {
  variants: readonly Variant[],
};

export let ModuleBuilder = ({variants}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList(variants, 2), []);
    let generateExercise = React.useCallback((): MyEx => {
      let variant = vlist.pickVariant();
      let choices = pickFromBag(variants.filter(x => x !== variant), 5, {
        withReplacement: false,
      });
      choices.push(variant);
      shuffle(choices);
      return {
        variant: variant,
        choices: choices,
      };
    }, [vlist]);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playTTS(
        'Which letter is ' + PRONUNCIATIONS[
          exercise.variant.toLowerCase() as keyof typeof PRONUNCIATIONS
        ]
      );
    }, [moduleContext]);
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
      initialPartial: () => 0,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let handleSelected = React.useCallback((index: number) => {
      if (index === exercise.choices.indexOf(exercise.variant)) {
        doPartialSuccess(1);
        doSuccess({sound: goodDing});
      } else {
        doFailure();
      }
    }, [exercise, doSuccess, doFailure]);

    let getFill = React.useCallback((element: Variant) => {
      if (element === exercise.variant) {
        if (partial === 1) {
          return '#00ff0033';
        }
        if (alreadyFailed) {
          return '#ff000033';
        }
      }
      return 'white';
    }, [exercise, partial, alreadyFailed]);

    let choices = (
      <ChoiceSelector
          choices={exercise.choices}
          howManyPerRow={6}
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

