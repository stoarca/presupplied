import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {WORDS} from '@src/modules/common/READING/util';
import sayWord from '@src/modules/common/READING/words/say';

const words = [
  'engineer',
  'astronaut',
  'firefighter',
  'doctor',
  'painter',
  'plumber',
  'driver',
  'chef',
  'actor',
  'mechanic',
  'accountant',
  'custodian'
] as const;

export type Variant = typeof words[number];

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
      () => new VariantList(variants.map(v => ({ variant: v, millicards: 1000 })), maxScorePerVariant), [variants, maxScorePerVariant]
    );
    let generateExercise = React.useCallback((): MyEx => {
      let variant = vlist.pickVariant();
      trainingRecorder.addEvent({
        kmid: 'REPEAT_WORDS',
        exerciseData: variant,
        status: 'start',
      });
      return {
        variant: variant,
      };
    }, [vlist, trainingRecorder]);
    let [showWord, setShowWord] = React.useState(false);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playAudio(sayWord.spoken);
      setShowWord(true);
      await moduleContext.playAudio(WORDS[exercise.variant].spoken);
      await new Promise(r => setTimeout(r, 2000));
      setShowWord(false);
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
        kmid: 'REPEAT_WORDS',
        exerciseData: exercise.variant,
        status: 'fail',
      });
      doFailure();
      doingFailure.current = true;
      await moduleContext.playAudio(WORDS[
        exercise.variant.toLowerCase() as keyof typeof WORDS
      ].spoken);
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doFailure, moduleContext]);

    let handleSuccess = React.useCallback(() => {
      doSuccess();
      trainingRecorder.addEvent({
        kmid: 'REPEAT_WORDS',
        exerciseData: exercise.variant,
        status: 'success',
      });
      doingFailure.current = false;
    }, [exercise, trainingRecorder, doSuccess]);

    let text;
    if (showWord) {
      let textStyle: React.CSSProperties = {
        fontFamily: 'sans-serif',
        fontSize: '100px',
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
