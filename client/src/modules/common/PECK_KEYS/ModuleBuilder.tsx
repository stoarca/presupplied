import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {pickFromBag, VariantList} from '@src/util';

import {goodDing} from '@modules/common/sounds';

type Variant = [string, string];

interface MyEx extends Ex<Variant> {
};

export let ModuleBuilder = (VARIANTS: Variant[]) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList(VARIANTS, 3), []);
    let generateExercise = React.useCallback(() => {
      return {
        variant: vlist.pickVariant(),
      };
    }, [vlist]);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      moduleContext.playTTS(`Press ${exercise.variant[1]}.`);
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
      initialPartial: (): number => 0,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    React.useEffect(() => {
      let listener = async (e: KeyboardEvent) => {
        if (e.key === exercise.variant[0]) {
          doSuccess({sound: goodDing});
        } else {
          doFailure();
        }
      }
      document.addEventListener('keypress', listener);
      return () => document.removeEventListener('keypress', listener);
    }, [moduleContext, exercise, doSuccess, doFailure]);

    let textStyle = {
      fontFamily: 'sans-serif',
      fontSize: '200px',
    } as React.CSSProperties;
    let text = (
      <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          y="50%"
          x="50%">
        {exercise.variant[0]}
      </text>
    );

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {text}
      </Module>
    );
  }
};
