import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {
  genRandPoints, dist, clamp, projectPointToLine, Point
} from '../../util';

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

  let playInstructions = React.useCallback(() => {
    moduleContext.playTTS('Trace the line with your finger.');
  }, [moduleContext]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, exercise]);

  let ERROR_RADIUS = 80;
  let [percentMoved, setPercentMoved] = React.useState(0);
  let line = exercise.line;
  let target = React.useMemo(() => {
    return {
      x: line[0].x * (1 - percentMoved) + line[1].x * percentMoved,
      y: line[0].y * (1 - percentMoved) + line[1].y * percentMoved,
    };
  }, [line, percentMoved]);
  let doFail = React.useCallback(() => {
    moduleContext.playSharedModuleAudio('bad_buzzer.wav');
    setScore(0);
  }, [moduleContext]);
  let [isDragging, setIsDragging] = React.useState(false);
  let handleTouchStart = React.useCallback((e: T) => {
    e.preventDefault();
    let t = e.touches[0];
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFail();
      return;
    }
    moduleContext.playSharedModuleAudio('good_ding.wav');
    setIsDragging(true);
  }, [moduleContext, exercise, percentMoved, target, doFail]);
  let handleTouchMove = React.useCallback((e: T) => {
    if (!isDragging) {
      return;
    }
    e.preventDefault();
    let t = e.touches[0];
    if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
      doFail();
      return;
    }
    let p = {x: t.clientX, y: t.clientY};
    let projectedPoint = projectPointToLine(p, exercise.line);
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
      moduleContext.playSharedModuleAudio('good_job.wav');
      setScore(old => old + 1);
      setPercentMoved(0);
      setExercise(generateExercise());
    }
  }, [moduleContext, percentMoved, doFail]);

  let targetLine = (
    <line stroke="black"
        strokeWidth="2"
        strokeDasharray="5,4"
        x1={line[0].x}
        y1={line[0].y}
        x2={line[1].x}
        y2={line[1].y}/>
  );

  let targetCircle = (
    <circle r={ERROR_RADIUS} cx={target.x} cy={target.y} fill="#ff000033"/>
  );

  return (
    <Module type="svg"
        score={score}
        maxScore={20}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
      {targetLine}
      {targetCircle}
    </Module>
  );
}

