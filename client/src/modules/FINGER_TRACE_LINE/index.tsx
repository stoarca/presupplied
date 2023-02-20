import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {SvgArrow} from '@src/SvgArrow';
import {
  genRandPoints, dist, clamp, projectPointToLine, Point, VariantList
} from '@src/util';

import {
  goodDing, badBuzzer, goodJob,
} from '@modules/common/sounds';

type M = React.TouchEvent<HTMLElement>;

interface MyEx extends Ex<number> {
  line: [Point, Point];
}

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList([0], 10), []);
  let generateExercise = React.useCallback(() => {
    return {
      variant: 0,
      line: genRandPoints(2, {
        paddingFromEdge: 200,
        paddingFromEachOther: 400,
      }) as [Point, Point],
    };
  }, []);
  let playInstructions = React.useCallback((exercise: MyEx) => {
    moduleContext.playTTS('Trace the line with your finger.');
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
    initialPartial: (): number => 0,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: false,
    vlist: vlist,
  });

  let ERROR_RADIUS = 70;
  React.useEffect(() => {
    if (partial === 1) {
      moduleContext.playAudio(goodDing);
    }
  }, [moduleContext, partial]);
  let line = exercise.line;
  let target = React.useMemo(() => {
    return {
      x: line[0].x * (1 - partial) + line[1].x * partial,
      y: line[0].y * (1 - partial) + line[1].y * partial,
    };
  }, [line, partial]);
  // LOH: setScore(0) on failure
  let [isDragging, setIsDragging] = React.useState(false);
  let handleTouchStart = React.useCallback((e: M) => {
    let t = e.touches[0];
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFailure();
      return;
    }
    doPartialSuccess(0);
    setIsDragging(true);
  }, [target, doPartialSuccess, doFailure]);
  let handleTouchMove = React.useCallback((e: M) => {
    if (!isDragging) {
      return;
    }
    if (partial >= 1) {
      return;
    }
    let t = e.touches[0];
    let p = {x: t.clientX, y: t.clientY};
    let projectedPoint = projectPointToLine(p, exercise.line);
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFailure();
      return;
    }
    let newPercentMoved = clamp(
      (projectedPoint.x - exercise.line[0].x) /
          (exercise.line[1].x - exercise.line[0].x),
      0,
      1
    );
    if (newPercentMoved > partial) {
      doPartialSuccess(newPercentMoved, newPercentMoved === 1);
    }
  }, [exercise, partial, isDragging, doFailure, doPartialSuccess]);
  let handleTouchEnd = React.useCallback(async (e: M) => {
    setIsDragging(false);
    if (partial < 1) {
      doFailure();
    } else {
      await doSuccess();
    }
  }, [partial, doFailure, doSuccess]);

  let targetLine = (
    <SvgArrow stroke="black"
        strokeWidth="2"
        strokeDasharray="5,4"
        chevronSize={10}
        x1={line[0].x}
        y1={line[0].y}
        x2={line[1].x}
        y2={line[1].y}/>
  );

  let targetFilled = (
    <line stroke="#ff000033"
        strokeWidth={ERROR_RADIUS * 2}
        strokeLinecap="round"
        x1={line[0].x}
        y1={line[0].y}
        x2={target.x}
        y2={target.y}/>
  );

  let targetCircle = (
    <circle r={ERROR_RADIUS} cx={target.x} cy={target.y} fill="#ff000033"/>
  );

  let targetComplete = null;
  if (partial === 1) {
    targetComplete = (
      <circle r={40} cx={target.x} cy={target.y} fill="#00ff0099"/>
    );
  }

  return (
    <Module type="svg"
        score={score}
        maxScore={10}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
      {targetLine}
      {targetFilled}
      {targetCircle}
      {targetComplete}
    </Module>
  );
}

