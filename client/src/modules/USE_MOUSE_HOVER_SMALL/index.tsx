import React from 'react';

import {Module, useInstructions} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {genRandPoint, dist} from '../../util';

import {goodJob} from '@modules/common/sounds';
import instructions from './instructions.wav';
import ohNoYouClicked from './oh_no_you_clicked.wav';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let TARGET_RADIUS = 30;
  let [score, setScore] = React.useState(0);
  let [target, setTarget] = React.useState(genRandPoint({
    paddingFromEdge: TARGET_RADIUS
  }));

  let playingInstructions = useInstructions(() => {
    return moduleContext.playAudio(instructions);
  }, target, [moduleContext]);

  let handleMouseMove = React.useCallback((e: M) => {
    if (dist({x: e.clientX, y: e.clientY}, target) < TARGET_RADIUS) {
      moduleContext.playAudio(goodJob);
      setScore(score + 1);
      setTarget(genRandPoint({
        paddingFromEdge: TARGET_RADIUS,
        farAwayFrom: [{point: target, dist: TARGET_RADIUS * 5}],
      }));
    }
  }, [score, moduleContext]);

  let handleMouseDown = React.useCallback((e: M) => {
    moduleContext.playAudio(ohNoYouClicked);
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

