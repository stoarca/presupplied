import React from 'react';

import {Module, useInstructions} from '../../../Module';
import {ModuleContext} from '../../../ModuleContext';
import {
  pickFromBag,
  VariantList,
  buildExercise,
} from '../../../util';

import {goodDing, badBuzzer} from '@modules/common/sounds';

export let ModuleBuilder = (VARIANTS: [string, string][]) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList(VARIANTS, 3), []);
    let [score, setScore] = React.useState(0);
    let [maxScore, setMaxScore] = React.useState(VARIANTS.length * 3);
    let generateExercise = React.useCallback(() => {
      return buildExercise({
        variant: vlist.pickVariant(),
      });
    }, []);
    let [exercise, setExercise] = React.useState(generateExercise);

    let playingInstructions = useInstructions(() => {
      return moduleContext.playTTS(`Press ${exercise.variant[1]}.`);
    }, exercise, [moduleContext, exercise]);

    React.useEffect(() => {
      let listener = async (e: KeyboardEvent) => {
        if (e.key === exercise.variant[0]) {
          moduleContext.playAudio(goodDing, {channel: 1});
          vlist.markSuccess(exercise.variant);
          setScore(old => old + 1);
          setExercise(generateExercise());
        } else {
          moduleContext.playAudio(badBuzzer);
          vlist.markFailure(exercise.variant, 3);
          setMaxScore(old => old + 3);
        }
      }
      document.addEventListener('keypress', listener);
      return () => document.removeEventListener('keypress', listener);
    }, [moduleContext, exercise, vlist]);

    let textStyle = {
      fontFamily: 'sans-serif',
      fontSize: '200px',
    } as React.CSSProperties;
    let text = (
      <text style={textStyle}
          dominantBaseline="central"
          textAnchor="middle"
          y="50%"
          x="50%">
        {exercise.variant[0]}
      </text>
    );

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {text}
      </Module>
    );
  }
};
