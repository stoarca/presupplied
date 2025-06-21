import React from 'react';

import {useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import sayWord from '@src/modules/common/READING/words/say';

interface MyEx<T> extends Ex<T> {
}

interface ModuleBuilderProps<T> {
  variants: readonly T[],
  maxScorePerVariant: number,
  getAudio: (exercise: MyEx<T>) => string,
  displayText?: (exercise: MyEx<T>) => string,
  fontSize?: string,
}

export let ModuleBuilder = <T extends string | number, >({
  variants,
  maxScorePerVariant,
  getAudio,
  displayText,
  fontSize = '200px'
}: ModuleBuilderProps<T>) => {
  return () => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: maxScorePerVariant * 1000 })), maxScorePerVariant * 1000), []
    );
    let generateExercise = React.useCallback((): MyEx<T> => {
      let variant = vlist.pickVariant();
      return {
        variant: variant,
      };
    }, [vlist]);
    let [showVariant, setShowVariant] = React.useState(false);
    let playInstructions = React.useCallback(async (exercise: MyEx<T>) => {
      await moduleContext.playAudio(sayWord.spoken);
      setShowVariant(true);
      await moduleContext.playAudio(getAudio(exercise));
      await new Promise(r => setTimeout(r, 2000));
      setShowVariant(false);
    }, [moduleContext, getAudio]);
    let {
      exercise,
      score,
      maxScore,
      doSuccess,
      doFailure,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: () => 0,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let doingFailure = React.useRef(false);
    let handleFailure = React.useCallback(async () => {
      if (doingFailure.current) {
        return;
      }
      doFailure();
      doingFailure.current = true;
      await moduleContext.playAudio(getAudio(exercise));
      doingFailure.current = false;
    }, [exercise, doFailure, moduleContext, getAudio]);

    let handleSuccess = React.useCallback(() => {
      doSuccess();
      doingFailure.current = false;
    }, [doSuccess]);

    let text;
    if (showVariant) {
      let textStyle: React.CSSProperties = {
        fontFamily: 'sans-serif',
        fontSize: fontSize,
      };
      text = (
        <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          x="50%"
          y="50%">
          {displayText ? displayText(exercise) : exercise.variant}
        </text>
      );
    } else {
      text = null;
    }
    return (
      <STTModule doSuccess={handleSuccess}
        doFailure={handleFailure}
        score={score}
        maxScore={maxScore}>
        {text}
      </STTModule>
    );
  };
};