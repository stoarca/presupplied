import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {
  SIMPLE_OBJECTS, pickFromBag, genRandPoints, pointInRect, VariantList
} from '../../util';

type M = React.MouseEvent<HTMLElement>;

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let [score, setScore] = React.useState(0);
  let generateExercise = React.useCallback(() => {
    return genRandPoints(2, {
      paddingFromEdge: 200,
      paddingFromEachOther: 400,
    });
  }, []);
  let [target, setTarget] = React.useState(generateExercise);

  let playInstructions = React.useCallback(() => {
    moduleContext.playAudio('Trace the line with your finger.');
  }, [moduleContext]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, exercise]);


  // LOH: finish this one

  return (
    <Module type="svg"
        score={score}
        maxScore={20}
        onClick={handleClick}>
      {targetImages}
    </Module>
  );
}

