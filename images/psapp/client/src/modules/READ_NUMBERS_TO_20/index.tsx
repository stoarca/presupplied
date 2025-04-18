import React from 'react';

import {useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';

import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';

type Variant = number;

interface MyEx extends Ex<Variant> {
}

let VARIANTS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS.map(v => ({ variant: v, millicards: 1000 })), 3), []);
  let generateExercise = React.useCallback(() => {
    return {
      variant: vlist.pickVariant(),
    };
  }, [vlist]);
  let playInstructions = React.useCallback((exercise: MyEx) => {
    moduleContext.playTTS('What is this number?');
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

  let textStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    fontSize: '200px',
  };
  let text = (
    <text style={textStyle}
      dominantBaseline="central"
      textAnchor="middle"
      y="200"
      x="50%">
      {exercise.variant}
    </text>
  );

  return (
    <STTModule doSuccess={doSuccess}
      doFailure={doFailure}
      score={score}
      maxScore={maxScore}>
      {text}
    </STTModule>
  );
};
