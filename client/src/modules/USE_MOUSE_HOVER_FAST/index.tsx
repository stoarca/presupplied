import React from 'react';

import {Module, useInstructions} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let TARGET_RADIUS = 75;
  let TIME_TO_HOVER = 3000;
  let [score, setScore] = React.useState(0);
  let [target, setTarget] = React.useState(genRandPoint({
    paddingFromEdge: TARGET_RADIUS
  }));
  let [opacity, setOpacity] = React.useState(1);

  let createNewTarget = React.useCallback(() => {
    return genRandPoint({
      paddingFromEdge: TARGET_RADIUS,
      farAwayFrom: [
        {point: target, dist: TARGET_RADIUS * 5},
      ],
    });
  }, [target]);

  let playingInstructions = useInstructions(() => {
    return moduleContext.playModuleAudio('instructions.wav');
  }, target, [moduleContext]);

  React.useEffect(() => {
    setOpacity(1);
    let startTime = Date.now();
    let interval = setInterval(() => {
      let diff = Date.now() - startTime;
      if (diff >= TIME_TO_HOVER) {
        moduleContext.playSharedModuleAudio('too_slow.wav');
        setTarget(createNewTarget());
        setScore(0);
      } else {
        setOpacity(1 - diff / TIME_TO_HOVER);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [target, createNewTarget]);

  let handleMouseMove = React.useCallback((e: M) => {
    if (dist({x: e.clientX, y: e.clientY}, target) < TARGET_RADIUS) {
      moduleContext.playSharedModuleAudio('good_job.wav');
      setScore(score + 1);
      setTarget(createNewTarget());
    }
  }, [score, moduleContext, target, createNewTarget]);

  let handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setScore(0);
  }, [moduleContext]);

  let fill = '#ff0000';
  fill += Math.round(255 * opacity).toString(16).padStart(2, '0');
  return (
    <Module type="svg"
        score={score}
        maxScore={20}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <circle cx={target.x} cy={target.y} r={TARGET_RADIUS} fill={fill}/>
    </Module>
  );
};

