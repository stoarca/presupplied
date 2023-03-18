import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {genRandPoint, dist, Point, VariantList} from '@src/util';

import {tooSlow} from '@modules/common/sounds';
import instructions from './instructions.wav';

type M = React.MouseEvent<HTMLElement>;

interface MyEx extends Ex<number> {
  target: Point,
}

interface ModuleBuilderProps {
  targetRadius: number,
  timeToSolve: number | null,
}

export let ModuleBuilder = ({
  targetRadius,
  timeToSolve,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList([0], 10), []);
    let generateExercise = React.useCallback((previous?: MyEx) => {
      let farAwayFrom = [];
      if (previous) {
        farAwayFrom.push({point: previous.target, dist: targetRadius * 5});
      }
      return {
        variant: 0,
        target: genRandPoint({
          paddingFromEdge: targetRadius,
          farAwayFrom: farAwayFrom,
        })
      };
    }, []);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      moduleContext.playAudio(instructions);
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

    let [opacity, setOpacity] = React.useState(1);
    React.useEffect(() => {
      if (timeToSolve === null) {
        return;
      }
      setOpacity(1);
      let startTime = Date.now();
      let interval = setInterval(() => {
        let diff = Date.now() - startTime;
        if (diff >= timeToSolve) {
          doFailure({
            sound: tooSlow,
            goToNewExercise: true,
          });
        } else {
          setOpacity(1 - diff / timeToSolve);
        }
      }, 50);
      return () => clearInterval(interval);
    }, [doFailure]);

    let handleClick = React.useCallback((e: M) => {
      if (dist({x: e.clientX, y: e.clientY}, exercise.target) < targetRadius) {
        doSuccess({waitForSound: false});
      } else {
        doFailure();
      }
    }, [exercise, doSuccess, doFailure]);

    let fill = '#ff0000';
    fill += Math.round(255 * opacity).toString(16).padStart(2, '0');
    return (
      <Module type="svg"
          score={score}
          maxScore={vlist.maxScore()}
          onClick={handleClick}>
        <circle cx={exercise.target.x}
            cy={exercise.target.y}
            r={targetRadius}
            fill={fill}/>
      </Module>
    );
  };
};

