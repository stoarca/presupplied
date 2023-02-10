import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  const moduleContext = React.useContext(ModuleContext);

  const TARGET_RADIUS = 75;
  const TIME_TO_HOVER = 3000;
  const [score, setScore] = React.useState(0);
  const [target, setTarget] = React.useState(genRandPoint(TARGET_RADIUS));
  const [opacity, setOpacity] = React.useState(1);

  const createNewTarget = React.useCallback(() => {
    let newTarget = genRandPoint(TARGET_RADIUS);
    while (dist(newTarget, target) < TARGET_RADIUS * 5) {
      newTarget = genRandPoint(TARGET_RADIUS);
    }
    return newTarget;
  }, [target]);
  const playInstructions = React.useCallback(() => {
    moduleContext.playModuleAudio('instructions.wav');
  }, [moduleContext]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    const interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, target]);

  React.useEffect(() => {
    setOpacity(1);
    let startTime = Date.now();
    const interval = setInterval(() => {
      let diff = Date.now() - startTime;
      if (diff >= TIME_TO_HOVER) {
        moduleContext.playModuleAudio('too_slow.wav');
        setTarget(createNewTarget());
        setScore(0);
      } else {
        setOpacity(1 - diff / TIME_TO_HOVER);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [target, createNewTarget]);

  const handleMouseMove = React.useCallback((e: M) => {
    if (dist({x: e.clientX, y: e.clientY}, target) < TARGET_RADIUS) {
      moduleContext.playSharedModuleAudio('good_job.wav');
      setScore(score + 1);
      setTarget(createNewTarget());
    }
  }, [score, moduleContext, target, createNewTarget]);

  const handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playModuleAudio('oh_no_you_clicked.wav');
    setScore(0);
  }, [moduleContext]);

  const svgStyle = {
    width: '100%',
    height: '100%',
  };
  let fill = '#ff0000';
  fill += Math.round(255 * opacity).toString(16).padStart(2, '0');
  return (
    <Module score={score}
        maxScore={20}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
      <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
        <circle cx={target.x} cy={target.y} r={TARGET_RADIUS} fill={fill}/>
      </svg>
    </Module>
  );
};

