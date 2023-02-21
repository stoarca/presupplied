import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';

import howManyFingers from './how_many_fingers.wav';

type M = React.MouseEvent<SVGRectElement>;

interface Variant {
  left: number;
  right: number;
}

interface MyEx extends Ex<Variant> {
}

let VARIANTS: Variant[] = [];

for (let i = 0; i <= 5; ++i) {
  for (let j = 0; j <= 5; ++j) {
    VARIANTS.push({
      left: i,
      right: j,
    });
  }
}

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 2), []);
  let generateExercise = React.useCallback(() => {
    let variant = vlist.pickVariant();
    return {
      variant: variant,
    };
  }, [vlist]);
  let playInstructions = React.useCallback((ex: MyEx) => {
    moduleContext.playAudio(howManyFingers);
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
    initialPartial: (): number | null => null,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: true,
    vlist: vlist,
  });

  let IMAGE_SIZE = 200;
  let imageStyle = {
    display: 'block',
  };
  let prefix = '/static/images/fingers/svg';
  let rhref = `${prefix}/right-hand-${exercise.variant.right}.svg`;
  let lhref = `${prefix}/right-hand-${exercise.variant.left}.svg`;
  let hands = (
    <g>
      <image href={rhref}
          style={imageStyle}
          x={`calc(50% - ${IMAGE_SIZE}px - 10px)`}
          y={`calc(50% - ${IMAGE_SIZE/2}px`}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}/>
      <image href={lhref}
          style={imageStyle}
          transform-origin="50% 50%"
          transform="scale(-1, 1)"
          x={`calc(50% - ${IMAGE_SIZE}px - 10px)`}
          y={`calc(50% - ${IMAGE_SIZE/2}px`}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}/>
    </g>
  );

  let handleSelected = React.useCallback(async (index: number) => {
    if (index === exercise.variant.left + exercise.variant.right) {
      await doPartialSuccess(index);
      doSuccess();
    } else {
      doFailure();
    }
  }, [exercise, partial, doSuccess, doPartialSuccess, doFailure]);
  let getFill = React.useCallback((choiceIndex: number) => {
    let fill = 'white';
    if (choiceIndex === partial) {
      fill = '#00ff0033';
    }
    return fill;
  }, [partial]);
  let choicesArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let choices = (
    <ChoiceSelector
        choices={choicesArr}
        howManyPerRow={10}
        getFill={getFill}
        onSelected={handleSelected}/>
  );

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      <g transform={`translate(0, -${IMAGE_SIZE})`}>
        {hands}
      </g>
      <g transform={`translate(0, ${IMAGE_SIZE})`}>
        {choices}
      </g>
    </Module>
  );
};
