import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';

interface MyEx<T> extends Ex<T> {
}

interface ModuleBuilderProps<T extends string> {
  variants: readonly T[],
  maxScorePerVariant: number,
  instructionAudio: string,
  trainingKmid: string,
  onFailureAudio?: (variant: T) => Promise<void>,
}

export let ModuleBuilder = <T extends string>({
  variants, maxScorePerVariant, instructionAudio, trainingKmid, onFailureAudio
}: ModuleBuilderProps<T>) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);
    let trainingRecorder = useTrainingDataRecorder();

    let vlist = React.useMemo(
      () => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: maxScorePerVariant * 1000 })), maxScorePerVariant * 1000), []
    );
    let generateExercise = React.useCallback((): MyEx<T> => {
      let variant = vlist.pickVariant();
      trainingRecorder.addEvent({
        kmid: trainingKmid,
        exerciseData: variant,
        status: 'start',
      });
      return {
        variant: variant,
      };
    }, [vlist, trainingRecorder, trainingKmid]);
    let playInstructions = React.useCallback(async (exercise: MyEx<T>) => {
      await moduleContext.playAudio(instructionAudio);
    }, [moduleContext, instructionAudio]);
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
      playOnEveryExercise: false,
      vlist: vlist,
    });

    let doingFailure = React.useRef(false);
    let handleFailure = React.useCallback(async () => {
      if (doingFailure.current) {
        return;
      }
      trainingRecorder.addEvent({
        kmid: trainingKmid,
        exerciseData: exercise.variant,
        status: 'fail',
      });
      doFailure();
      doingFailure.current = true;
      if (onFailureAudio) {
        await onFailureAudio(exercise.variant);
      }
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doFailure, moduleContext, trainingKmid, onFailureAudio]);

    let handleSuccess = React.useCallback(() => {
      doSuccess();
      trainingRecorder.addEvent({
        kmid: trainingKmid,
        exerciseData: exercise.variant,
        status: 'success',
      });
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doSuccess, trainingKmid]);

    let textStyle: React.CSSProperties = {
      fontFamily: 'sans-serif',
      fontSize: '200px',
    };
    let text = (
      <text style={textStyle}
        dominantBaseline="central"
        textAnchor="middle"
        x="50%"
        y="50%">
        {exercise.variant}
      </text>
    );
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