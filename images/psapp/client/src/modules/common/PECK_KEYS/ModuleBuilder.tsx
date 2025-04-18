import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, PRONUNCIATIONS} from '@src/util';

import {goodDing, tooSlow} from '@modules/common/sounds';

import KeyboardSvg from '@src/modules/common/keyboard.svg';

export type Variant = keyof typeof PRONUNCIATIONS;

interface MyEx extends Ex<Variant> {
};

interface ModuleBuilderProps {
  variants: Variant[],
  timeLimitPerExercise: number | null,
};

export let ModuleBuilder = ({
  variants,
  timeLimitPerExercise,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList(variants.map(v => ({ variant: v, millicards: 1000 })), 3), [variants]);
    let generateExercise = React.useCallback(() => {
      return {
        variant: vlist.pickVariant(),
      };
    }, [vlist]);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      moduleContext.playTTS(`Press ${PRONUNCIATIONS[exercise.variant]}.`);
    }, [moduleContext]);
    let {
      exercise,
      score,
      maxScore,
      doSuccess,
      doFailure,
      alreadyFailed,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): number => 0,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let [opacity, setOpacity] = React.useState(1);
    React.useEffect(() => {
      if (timeLimitPerExercise === null) {
        return;
      }
      setOpacity(1);
      if (alreadyFailed) {
        return;
      }
      let startTime = Date.now();
      let interval = setInterval(() => {
        let diff = Date.now() - startTime;
        if (diff >= timeLimitPerExercise) {
          doFailure({
            sound: tooSlow,
          });
        } else {
          setOpacity(1 - diff / timeLimitPerExercise);
        }
      }, 50);
      return () => clearInterval(interval);
    }, [alreadyFailed, doFailure]);

    React.useEffect(() => {
      let listener = (e: KeyboardEvent) => {
        if (e.key === exercise.variant) {
          doSuccess({sound: goodDing});
        } else {
          doFailure();
        }
      };
      document.addEventListener('keypress', listener);
      return () => document.removeEventListener('keypress', listener);
    }, [moduleContext, exercise, doSuccess, doFailure]);

    let textStyle: React.CSSProperties = {
      fontFamily: 'sans-serif',
      fontSize: '200px',
    };
    let text = (
      <text style={textStyle}
        dominantBaseline="central"
        textAnchor="middle"
        opacity={opacity}
        y="200"
        x="50%">
        {exercise.variant}
      </text>
    );

    let keyboard = null;
    if (alreadyFailed) {
      let styleTag = (
        <style>
          #key-{exercise.variant} {'{'}
            fill: red !important;
          {'}'}
        </style>
      );
      keyboard = (
        <g transform="translate(-400 0)">
          {styleTag}
          <KeyboardSvg width="800" height="800" x="50%" y="400" viewBox="0 0 176 176"/>
        </g>
      );
    }

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {text}
        {keyboard}
      </Module>
    );
  };
};
