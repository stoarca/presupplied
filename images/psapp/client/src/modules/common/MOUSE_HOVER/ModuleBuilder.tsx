import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {
  ProbabilisticDeck,
  Point,
  genRandPoint,
  dist
} from '@src/util';

import {tooSlow} from '@modules/common/sounds';
import instructions from './instructions.wav';
import ohNoYouClicked from './oh_no_you_clicked.wav';

type M = React.MouseEvent<HTMLElement>;

interface MyEx extends Ex<number> {
  target: Point,
}

interface ModuleBuilderProps {
  targetRadius: number,
  timeToHover: number | null,
}

export let ModuleBuilder = ({
  targetRadius,
  timeToHover,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new ProbabilisticDeck([{ variant: 0, millicards: 10000 }], 10000), []);
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
      score,
      doSuccess,
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
      if (timeToHover === null) {
        return;
      }
      setOpacity(1);
      let startTime = Date.now();
      let interval = setInterval(() => {
        let diff = Date.now() - startTime;
        if (diff >= timeToHover) {
          doFailure({
            sound: tooSlow,
            goToNewExercise: true,
          });
        } else {
          setOpacity(1 - diff / timeToHover);
        }
      }, 50);
      return () => clearInterval(interval);
    }, [doFailure]);

    let handleMouseMove = React.useCallback((e: M) => {
      if (dist({x: e.clientX, y: e.clientY}, exercise.target) < targetRadius) {
        doSuccess({waitForSound: false});
      }
    }, [exercise, doSuccess]);

    let handleMouseDown = React.useCallback((e: M) => {
      doFailure(ohNoYouClicked);
    }, [doFailure]);

    let fill = '#ff0000';
    fill += Math.round(255 * opacity).toString(16).padStart(2, '0');
    return (
      <Module type="svg"
        score={score}
        maxScore={vlist.maxScore()}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}>
        <circle cx={exercise.target.x}
          cy={exercise.target.y}
          r={targetRadius}
          fill={fill}/>
      </Module>
    );
  };
};

