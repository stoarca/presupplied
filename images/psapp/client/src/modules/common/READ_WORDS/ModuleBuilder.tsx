import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';
import {LETTER_SOUNDS, BIGRAM_SOUNDS} from '@src/modules/common/READING/util';

import whatWordIsThis from './what_word_is_this.wav';

type Variant = {
  word: string,
  sounds: readonly (readonly [number, keyof typeof LETTER_SOUNDS | keyof typeof BIGRAM_SOUNDS])[],
  spoken: string,
};

interface MyEx extends Ex<Variant> {
}

interface ModuleBuilderProps {
  variants: Variant[];
}
export let ModuleBuilder = ({
  variants
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    React.useEffect(() => {
      let preloads = new Set<string>();
      for (let variant of variants) {
        preloads.add(variant.spoken);
        for (let [_, sound] of variant.sounds) {
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

    let vlist = React.useMemo(() => new VariantList(variants, 5), []);
    let generateExercise = React.useCallback(() => {
      return {
        variant: vlist.pickVariant(),
      };
    }, [vlist]);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playAudio(whatWordIsThis);
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
      initialPartial: () => null,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: false,
      vlist: vlist,
    });

    let doingFailure = React.useRef(false);
    let [failPosition, setFailPosition] = React.useState([0, 0]);
    let handleFailure = React.useCallback(async () => {
      if (doingFailure.current) {
        return;
      }
      doFailure();
      doingFailure.current = true;
      for (let i = 0; i < exercise.variant.sounds.length; ++i) {
        if (!doingFailure.current) {
          return;
        }
        let startPos = exercise.variant.sounds[i][0];
        let lastPos;
        if (i === exercise.variant.sounds.length - 1) {
          lastPos = exercise.variant.word.length;
        } else {
          lastPos = exercise.variant.sounds[i + 1][0];
        }
        setFailPosition([startPos, lastPos]);
        let sound = exercise.variant.sounds[i][1];
        if (sound in LETTER_SOUNDS) {
          // TODO: why does typescript not narrow the type here by itself?
          await moduleContext.playAudio(
            LETTER_SOUNDS[sound as keyof typeof LETTER_SOUNDS]
          );
        } else {
          await moduleContext.playAudio(
            BIGRAM_SOUNDS[sound as keyof typeof BIGRAM_SOUNDS]
          );
        }
        if (!doingFailure.current) {
          return;
        }
        if (exercise.variant.sounds.length > 6) {
          await new Promise(r => setTimeout(r, 50));
        } else if (exercise.variant.sounds.length > 4) {
          await new Promise(r => setTimeout(r, 250));
        } else {
          await new Promise(r => setTimeout(r, 500));
        }
      }
      if (!doingFailure.current) {
        return;
      }
      setFailPosition([0, exercise.variant.word.length]);
      await moduleContext.playAudio(exercise.variant.spoken);
      setFailPosition([0, 0]);
      doingFailure.current = false;
    }, [exercise, failPosition, doingFailure, doFailure, moduleContext]);

    let handleSuccess = React.useCallback(() => {
      doSuccess();
      doingFailure.current = false;
      setFailPosition([0, 0]);
    }, []);

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
          {exercise.variant.word.substring(0, failPosition[0])}
        </tspan>
        <tspan fill="red">
          {exercise.variant.word.substring(failPosition[0], failPosition[1])}
        </tspan>
        <tspan>
          {exercise.variant.word.substring(failPosition[1])}
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
};
