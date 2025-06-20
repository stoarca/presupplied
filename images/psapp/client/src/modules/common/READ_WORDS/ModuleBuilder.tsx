import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {LETTER_SOUNDS, BIGRAM_SOUNDS} from '@src/modules/common/READING/util';
import {pronounceStepByStep} from '@src/modules/common/READING/pronunciation';

import whatWordIsThis from './what_word_is_this.wav';
import whatSoundDoesThisMake from './what_sound_does_this_make.wav';

export type Variant = {
  word: string,
  sounds: readonly (readonly [number, keyof typeof LETTER_SOUNDS | keyof typeof BIGRAM_SOUNDS])[],
  spoken: string,
};

interface MyEx extends Ex<Variant> {
}

interface ModuleBuilderProps {
  variants: Variant[];
  maxScorePerVariant?: number;
  pronounceOnSuccess?: boolean;
  isSingleSound?: boolean;
}
export let ModuleBuilder = ({
  variants, maxScorePerVariant=2, isSingleSound, pronounceOnSuccess,
}: ModuleBuilderProps) => {
  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';
  let moduleContext = React.useContext(ModuleContext);
  let trainingRecorder = useTrainingDataRecorder();

  React.useEffect(() => {
    let preloads = new Set<string>();
    for (let variant of variants) {
      preloads.add(variant.spoken);
      for (let [_, sound] of variant.sounds) { // eslint-disable-line no-unused-vars
        if (sound in LETTER_SOUNDS) {
          preloads.add(LETTER_SOUNDS[sound as keyof typeof LETTER_SOUNDS]);
        } else {
          preloads.add(BIGRAM_SOUNDS[sound as keyof typeof BIGRAM_SOUNDS]);
        }
      }
    }
    let promises = Array.from(preloads.values()).map((x) => {
      return new Promise((resolve) => {
        let audio = new Audio(x);
        audio.addEventListener('canplaythrough', resolve);
      });
    });
    Promise.all(promises).then(() => {
      console.log('all sounds are loaded');
    });
  }, [variants]);

  let vlist = React.useMemo(() => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: maxScorePerVariant * 1000 })), maxScorePerVariant * 1000), []);
  let generateExercise = React.useCallback(() => {
    let variant = vlist.pickVariant();
    if (!admin) {
      trainingRecorder.addEvent({
        kmid: 'READ_WORDS',
        exerciseData: variant.word,
        status: 'start'
      });
    }
    return {
      variant: vlist.pickVariant(),
    };
  }, [vlist, trainingRecorder]);
  let playInstructions = React.useCallback(async (exercise: MyEx) => {
    if (isSingleSound) {
      await moduleContext.playAudio(whatSoundDoesThisMake);
    } else {
      await moduleContext.playAudio(whatWordIsThis);
    }
  }, [moduleContext, isSingleSound]);
  let {
    exercise,
    score,
    maxScore,
    doSuccess,
    doFailure,
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: () => null,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: false,
    vlist: vlist,
  });

  let addTrainingEvent = React.useCallback((
    status: 'start' | 'success' | 'fail'
  ) => {
    if (!admin) {
      trainingRecorder.addEvent({
        kmid: 'READ_WORDS',
        exerciseData: exercise.variant.word,
        status: status,
      });
    }
  }, [trainingRecorder, exercise]);

  let pronounceAbortController = React.useRef(new AbortController());
  let [pronouncePosition, setPronouncePosition] = React.useState([0, 0]);
  let _pronounce = React.useCallback(async (signal: AbortSignal) => {
    await pronounceStepByStep({
      moduleContext,
      sounds: exercise.variant.sounds,
      word: exercise.variant.word,
      spokenAudio: exercise.variant.spoken,
      isSingleSound,
      onPositionChange: setPronouncePosition,
      signal
    });
  }, [exercise, moduleContext, isSingleSound]);
  let pronounce = React.useCallback(async () => {
    pronounceAbortController.current.abort();
    pronounceAbortController.current = new AbortController();
    await _pronounce(pronounceAbortController.current.signal);
  }, [_pronounce]);

  let doingFailure = React.useRef(false);
  let handleFailure = React.useCallback(async () => {
    if (doingFailure.current) {
      return;
    }
    addTrainingEvent('fail');
    doFailure();
    doingFailure.current = true;
    await pronounce();
    doingFailure.current = false;
  }, [doFailure, addTrainingEvent, pronounce]);

  let handleSuccess = React.useCallback(async () => {
    doingFailure.current = false;
    addTrainingEvent('success');
    if (pronounceOnSuccess) {
      await pronounce();
    }
    pronounceAbortController.current.abort();
    doSuccess();
  }, [doSuccess, addTrainingEvent, pronounce]);

  let textStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    fontSize: '200px',
  };
  console.log('rendering');
  console.log(pronouncePosition);
  console.log(exercise.variant.word);
  console.log(exercise.variant.word.substring(0, pronouncePosition[0]));
  let text = (
    <text style={textStyle}
      dominantBaseline="central"
      textAnchor="middle"
      y="50%"
      x="50%">
      <tspan>
        {exercise.variant.word.substring(0, pronouncePosition[0])}
      </tspan>
      <tspan fill="red">
        {exercise.variant.word.substring(pronouncePosition[0], pronouncePosition[1])}
      </tspan>
      <tspan>
        {exercise.variant.word.substring(pronouncePosition[1])}
      </tspan>
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
