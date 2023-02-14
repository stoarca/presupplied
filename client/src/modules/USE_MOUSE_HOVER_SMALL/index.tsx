import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  const TARGET_RADIUS = 30;
  const [score, setScore] = React.useState(0);
  const [target, setTarget] = React.useState(genRandPoint({
    paddingFromEdge: TARGET_RADIUS
  }));

  const playInstructions = React.useCallback(() => {
    moduleContext.playModuleAudio('instructions.wav');
  }, [moduleContext]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, target]);

  const handleMouseMove = React.useCallback((e: M) => {
    if (dist({x: e.clientX, y: e.clientY}, target) < TARGET_RADIUS) {
      moduleContext.playSharedModuleAudio('good_job.wav');
      setScore(score + 1);
      setTarget(genRandPoint({
        paddingFromEdge: TARGET_RADIUS,
        farAwayFrom: [{point: target, dist: TARGET_RADIUS * 5}],
      }));
    }
  }, [score, moduleContext]);

  const handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setScore(0);
  }, [moduleContext]);

  return (
    <Module type="svg"
        score={score}
        maxScore={20}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <circle cx={target.x} cy={target.y} r={TARGET_RADIUS} fill="blue"/>
    </Module>
  );
};

