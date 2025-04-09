import React from 'react';

import {useExercise, useTrainingDataRecorder, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, withAbort} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {LETTER_SOUNDS, BIGRAM_SOUNDS} from '@src/modules/common/READING/util';

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

  let vlist = React.useMemo(() => new VariantList(variants, maxScorePerVariant), []);
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
    for (let i = 0; i < exercise.variant.sounds.length; ++i) {
      let startPos = exercise.variant.sounds[i][0];
      let lastPos;
      if (i === exercise.variant.sounds.length - 1) {
        lastPos = exercise.variant.word.length;
      } else {
        lastPos = exercise.variant.sounds[i + 1][0];
      }
      setPronouncePosition([startPos, lastPos]);
      let sound = exercise.variant.sounds[i][1];
      if (sound in LETTER_SOUNDS) {
        // TODO: why does typescript not narrow the type here by itself?
        await withAbort(() => moduleContext.playAudio(
          LETTER_SOUNDS[sound as keyof typeof LETTER_SOUNDS]
        ), signal);
      } else {
        await withAbort(() => moduleContext.playAudio(
          BIGRAM_SOUNDS[sound as keyof typeof BIGRAM_SOUNDS]
        ), signal);
      }
      if (exercise.variant.sounds.length > 6) {
        await withAbort(() => new Promise(r => setTimeout(r, 50)), signal);
      } else if (exercise.variant.sounds.length > 4) {
        await withAbort(() => new Promise(r => setTimeout(r, 250)), signal);
      } else {
        await withAbort(() => new Promise(r => setTimeout(r, 500)), signal);
      }
    }
    setPronouncePosition([0, exercise.variant.word.length]);
    if (!isSingleSound) {
      await withAbort(
        () => moduleContext.playAudio(exercise.variant.spoken),
        signal
      );
    }
  }, [exercise, moduleContext, isSingleSound]);
  let pronounce = React.useCallback(async () => {
    pronounceAbortController.current.abort();
    pronounceAbortController.current = new AbortController();
    await _pronounce(pronounceAbortController.current.signal);
    setPronouncePosition([0, 0]);
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
