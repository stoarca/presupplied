import React from 'react';

import {Module, useInstructions} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let TARGET_RADIUS = 75;
  let [score, setScore] = React.useState(0);
  let [target, setTarget] = React.useState(genRandPoint({
    paddingFromEdge: TARGET_RADIUS
  }));

  let playingInstructions = useInstructions(() => {
    return moduleContext.playModuleAudio('instructions.wav');
  }, target, [moduleContext]);

  let handleMouseMove = React.useCallback((e: M) => {
    if (dist({x: e.clientX, y: e.clientY}, target) < TARGET_RADIUS) {
      moduleContext.playSharedModuleAudio('good_job.wav');
      setScore(score + 1);
      setTarget(genRandPoint({
        paddingFromEdge: TARGET_RADIUS,
        farAwayFrom: [{point: target, dist: TARGET_RADIUS * 5}],
      }));
    }
  }, [score, moduleContext]);

  let handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setScore(0);
  }, [moduleContext]);

  return (
    <Module type="svg"
        score={score}
        maxScore={20}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <circle cx={target.x} cy={target.y} r={TARGET_RADIUS} fill="red"/>
    </Module>
  );
};

