import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {LETTERS} from '@src/modules/common/READING/util';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;

import whichLetterIsThis from './which_letter_is_this.wav';

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
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);
    let trainingRecorder = useTrainingDataRecorder();

    let vlist = React.useMemo(
      () => new VariantList(variants.map(v => ({ variant: v, millicards: 1000 })), maxScorePerVariant), []
    );
    let generateExercise = React.useCallback((): MyEx => {
      let variant = vlist.pickVariant();
      trainingRecorder.addEvent({
        kmid: 'READ_LETTERS',
        exerciseData: variant,
        status: 'start',
      });
      return {
        variant: variant,
      };
    }, [vlist, trainingRecorder]);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playAudio(whichLetterIsThis);
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
      playOnEveryExercise: false,
      vlist: vlist,
    });

    let doingFailure = React.useRef(false);
    let handleFailure = React.useCallback(async () => {
      if (doingFailure.current) {
        return;
      }
      trainingRecorder.addEvent({
        kmid: 'READ_LETTERS',
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
        kmid: 'READ_LETTERS',
        exerciseData: exercise.variant,
        status: 'success',
      });
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doSuccess]);

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
