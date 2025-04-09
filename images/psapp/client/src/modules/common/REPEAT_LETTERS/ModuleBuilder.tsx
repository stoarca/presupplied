import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {LETTERS} from '@src/modules/common/READING/util';
import sayWord from '@src/modules/common/READING/words/say';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] as const;

export type Variant = typeof letters[number];

interface MyEx extends Ex<Variant> {
}

interface ModuleBuilderProps {
  variants: readonly Variant[],
  maxScorePerVariant: number,
}

export let ModuleBuilder = ({
  variants, maxScorePerVariant
}: ModuleBuilderProps) => {
  return () => {
    let moduleContext = React.useContext(ModuleContext);
    let trainingRecorder = useTrainingDataRecorder();

    let vlist = React.useMemo(
      () => new VariantList(variants, maxScorePerVariant), []
    );
    let generateExercise = React.useCallback((): MyEx => {
      let variant = vlist.pickVariant();
      trainingRecorder.addEvent({
        kmid: 'REPEAT_LETTERS',
        exerciseData: variant,
        status: 'start',
      });
      return {
        variant: variant,
      };
    }, [vlist, trainingRecorder]);
    let [showLetter, setShowLetter] = React.useState(false);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playAudio(sayWord.spoken);
      setShowLetter(true);
      await moduleContext.playAudio(LETTERS[exercise.variant]);
      await new Promise(r => setTimeout(r, 2000));
      setShowLetter(false);
    }, [moduleContext]);
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
      trainingRecorder.addEvent({
        kmid: 'REPEAT_LETTERS',
        exerciseData: exercise.variant,
        status: 'fail',
      });
      doFailure();
      doingFailure.current = true;
      await moduleContext.playAudio(LETTERS[
        exercise.variant.toLowerCase() as keyof typeof LETTERS
      ]);
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doFailure, moduleContext]);

    let handleSuccess = React.useCallback(() => {
      doSuccess();
      trainingRecorder.addEvent({
        kmid: 'REPEAT_LETTERS',
        exerciseData: exercise.variant,
        status: 'success',
      });
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doSuccess]);

    let text;
    if (showLetter) {
      let textStyle: React.CSSProperties = {
        fontFamily: 'sans-serif',
        fontSize: '200px',
      };
      text = (
        <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          x="50%"
          y="50%">
          {exercise.variant.toUpperCase()} {exercise.variant}
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
