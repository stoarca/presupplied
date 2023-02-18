import React from 'react';

import {Module, useInstructions} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {SvgArrow} from '@src/SvgArrow';
import {
  genRandPoints, dist, clamp, projectPointToLine, Point
} from '@src/util';

import {
  goodDing, badBuzzer, goodJob,
} from '@modules/common/sounds';

type M = React.MouseEvent<HTMLElement>;
type T = React.TouchEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let [score, setScore] = React.useState(0);
  let generateExercise = React.useCallback(() => {
    return {
      line: genRandPoints(2, {
        paddingFromEdge: 200,
        paddingFromEachOther: 400,
      }) as [Point, Point],
    };
  }, []);
  let [exercise, setExercise] = React.useState(generateExercise);

  let playingInstructions = useInstructions(() => {
    return moduleContext.playTTS('Trace the line with your finger.');
  }, exercise, [moduleContext]);

  let ERROR_RADIUS = 70;
  let [percentMoved, setPercentMoved] = React.useState(0);
  React.useEffect(() => {
    if (percentMoved === 1) {
      moduleContext.playAudio(goodDing);
    }
  }, [moduleContext, percentMoved]);
  let line = exercise.line;
  let target = React.useMemo(() => {
    return {
      x: line[0].x * (1 - percentMoved) + line[1].x * percentMoved,
      y: line[0].y * (1 - percentMoved) + line[1].y * percentMoved,
    };
  }, [line, percentMoved]);
  let [doingFail, setDoingFail] = React.useState(false);
  let doFail = React.useCallback(async () => {
    setScore(0);
    if (doingFail) {
      return;
    }
    setDoingFail(true);
    await moduleContext.playAudio(badBuzzer);
    setDoingFail(false);
  }, [moduleContext, doingFail]);
  let [isDragging, setIsDragging] = React.useState(false);
  let handleTouchStart = React.useCallback((e: T) => {
    let t = e.touches[0];
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFail();
      return;
    }
    moduleContext.playAudio(goodDing);
    setIsDragging(true);
  }, [moduleContext, exercise, percentMoved, target, doFail]);
  let handleTouchMove = React.useCallback((e: T) => {
    if (!isDragging) {
      return;
    }
    if (percentMoved >= 1) {
      return;
    }
    let t = e.touches[0];
    let p = {x: t.clientX, y: t.clientY};
    let projectedPoint = projectPointToLine(p, exercise.line);
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFail();
      return;
    }
    let newPercentMoved = clamp(
      (projectedPoint.x - exercise.line[0].x) /
          (exercise.line[1].x - exercise.line[0].x),
      0,
      1
    );
    if (newPercentMoved > percentMoved) {
      setPercentMoved(newPercentMoved);
    }
  }, [exercise, percentMoved, isDragging, doFail]);
  let handleTouchEnd = React.useCallback((e: T) => {
    setIsDragging(false);
    if (percentMoved < 1) {
      doFail();
    } else {
      moduleContext.playAudio(goodJob, {channel: 1});
      setScore(old => old + 1);
      setPercentMoved(0);
      setExercise(generateExercise());
    }
  }, [moduleContext, percentMoved, doFail]);

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
  if (percentMoved === 1) {
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

