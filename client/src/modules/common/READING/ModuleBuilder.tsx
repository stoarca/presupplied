import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, PRONUNCIATIONS} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';

export type Variant = () => string;

export interface MyEx extends Ex<Variant> {
  displayText: string;
}

interface ModuleBuilderProps {
  variants: Variant[];
  maxScorePerVariant: number;
  getInstructions: (exercise: MyEx) => string;
}

export let ModuleBuilder = ({
  variants,
  maxScorePerVariant,
  getInstructions,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new VariantList(variants, maxScorePerVariant), []
    );
    let generateExercise = React.useCallback(() => {
      let variant = vlist.pickVariant();
      return {
        variant: variant,
        displayText: variant(),
      };
    }, [vlist]);
    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      let instructions = getInstructions(exercise);
      await moduleContext.playTTS(instructions);
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
      initialPartial: (): string[] => [],
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });
    
    let style: React.CSSProperties = {
      fontFamily: 'sans-serif',
      fontSize: '100px',
    };
    return (
      <STTModule doSuccess={doSuccess}
          doFailure={doFailure}
          score={score}
          maxScore={maxScore}>
        <text style={style}
            dominantBaseline="central"
            textAnchor="middle"
            y="200"
            x="50%">
          {exercise.displayText}
        </text>
      </STTModule>
    );
  };
};
