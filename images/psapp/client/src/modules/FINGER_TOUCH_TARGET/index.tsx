import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {
  ProbabilisticDeck,
  Point,
  genRandPoint,
  dist
} from '@src/util';

type T = React.TouchEvent<HTMLElement>;

interface MyEx extends Ex<number> {
  target: Point,
}

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new ProbabilisticDeck([{ variant: 0, millicards: 10000 }], 10000), []);
  let generateExercise = React.useCallback((previous?: MyEx) => {
    const targetRadius = 150;
    let farAwayFrom = [];
    if (previous) {
      farAwayFrom.push({point: previous.target, dist: targetRadius * 2});
    }
    return {
      variant: 0,
      target: genRandPoint({
        paddingFromEdge: targetRadius,
        farAwayFrom: farAwayFrom,
      })
    };
  }, []);
  let playInstructions = React.useCallback((exercise: MyEx) => {
    moduleContext.playTTS('Touch the red circle with your finger.');
  }, [moduleContext]);
  let {
    exercise,
    score,
    doSuccess,
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: (): number => 0,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: false,
    vlist: vlist,
  });

  const targetRadius = 150;

  let handleTouchStart = React.useCallback((e: T) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch && dist({x: touch.clientX, y: touch.clientY}, exercise.target) < targetRadius) {
      doSuccess({waitForSound: false});
    }
  }, [exercise, doSuccess]);

  return (
    <Module type="svg"
      score={score}
      maxScore={vlist.maxScore()}
      onTouchStart={handleTouchStart}>
      <circle cx={exercise.target.x}
        cy={exercise.target.y}
        r={targetRadius}
        fill="#ff0000"/>
    </Module>
  );
};