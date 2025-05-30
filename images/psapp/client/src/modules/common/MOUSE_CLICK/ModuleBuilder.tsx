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
import instructionsMouse from './instructions_mouse.wav';
import instructionsPen from './instructions_pen.wav';

type P = React.PointerEvent<HTMLElement>;

interface MyEx extends Ex<number> {
  target: Point,
}

interface ModuleBuilderProps {
  targetRadius: number,
  timeToSolve: number | null,
  tool: 'mouse' | 'pen',
}

export let ModuleBuilder = ({
  targetRadius,
  timeToSolve,
  tool,
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
      let instructions = instructionsMouse;
      if (tool === 'pen') {
        instructions = instructionsPen;
      }
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

    let [showCursor, setShowCursor] = React.useState(true);
    let handleDown = React.useCallback((e: P) => {
      setShowCursor(e.pointerType === 'mouse');
      if (tool === 'pen' && e.pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.pointerType !== tool) {
        doFailure();
        return;
      }
      if (dist({x: e.clientX, y: e.clientY}, exercise.target) > targetRadius) {
        doFailure();
      }
    }, [exercise, doFailure]);
    let handleUp = React.useCallback((e: P) => {
      if (tool === 'pen' && e.pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.pointerType !== tool) {
        doFailure();
        return;
      }
      if (dist({x: e.clientX, y: e.clientY}, exercise.target) <= targetRadius) {
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
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        extraSvgStyles={{cursor: showCursor ? 'default' : 'none'}}>
        <circle cx={exercise.target.x}
          cy={exercise.target.y}
          r={targetRadius}
          fill={fill}/>
      </Module>
    );
  };
};

