import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  const moduleContext = React.useContext(ModuleContext);

  const TARGET_RADIUS = 75;
  const [score, setScore] = React.useState(0);
  const [target, setTarget] = React.useState(genRandPoint(TARGET_RADIUS));

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
      let newTarget = genRandPoint(TARGET_RADIUS);
      while (dist(newTarget, target) < TARGET_RADIUS * 5) {
        newTarget = genRandPoint(TARGET_RADIUS);
      }
      setTarget(newTarget);
    }
  }, [score, moduleContext]);

  const handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setScore(0);
  }, [moduleContext]);

  const svgStyle = {
    width: '100%',
    height: '100%',
  };
  return (
    <Module score={score}
        maxScore={20}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
        <circle cx={target.x} cy={target.y} r={TARGET_RADIUS} fill="red"/>
      </svg>
    </Module>
  );
};

