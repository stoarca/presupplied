import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';

import {tooSlow} from '@modules/common/sounds';
import howManyFingers from './how_many_fingers.wav';

type M = React.MouseEvent<SVGRectElement>;

interface Variant {
  left: number;
  right: number;
}

interface MyEx extends Ex<Variant> {
}

let VARIANTS: Variant[] = [];

for (let i = 0; i <= 5; ++i) {
  for (let j = 0; j <= 5; ++j) {
    VARIANTS.push({
      left: i,
      right: j,
    });
  }
}

interface ModuleBuilderProps {
  timeLimitPerExercise: number | null,
}

export let ModuleBuilder = ({
  timeLimitPerExercise,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new VariantList(VARIANTS, 2), []);
    let generateExercise = React.useCallback(() => {
      let variant = vlist.pickVariant();
      return {
        variant: variant,
      };
    }, [vlist]);
    let playInstructions = React.useCallback((ex: MyEx) => {
      moduleContext.playAudio(howManyFingers);
    }, [moduleContext]);
    let {
      exercise,
      partial,
      score,
      maxScore,
      doSuccess,
      doPartialSuccess,
      doFailure,
      alreadyFailed,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): number | null => null,
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let [alreadySucceeded, setAlreadySucceeded] = React.useState(false);
    let [opacity, setOpacity] = React.useState(1);
    React.useEffect(() => {
      if (timeLimitPerExercise === null) {
        return;
      }
      setOpacity(1);
      if (alreadyFailed || alreadySucceeded) {
        return;
      }
      let startTime = Date.now();
      let interval = setInterval(() => {
        let diff = Date.now() - startTime;
        if (diff >= timeLimitPerExercise) {
          doFailure({
            sound: tooSlow,
          });
        } else {
          setOpacity(1 - diff / timeLimitPerExercise);
        }
      }, 50);
      return () => clearInterval(interval);
    }, [alreadyFailed, alreadySucceeded, doFailure]);

    let IMAGE_SIZE = 200;
    let imageStyle = {
      display: 'block',
    };
    let prefix = '/static/images/fingers/svg';
    let rhref = `${prefix}/right-hand-${exercise.variant.right}.svg`;
    let lhref = `${prefix}/right-hand-${exercise.variant.left}.svg`;
    let hands = (
      <g opacity={opacity}>
        <image href={rhref}
            style={imageStyle}
            x={`calc(50% - ${IMAGE_SIZE}px - 10px)`}
            y={`calc(50% - ${IMAGE_SIZE/2}px`}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}/>
        <image href={lhref}
            style={imageStyle}
            transform-origin="50% 50%"
            transform="scale(-1, 1)"
            x={`calc(50% - ${IMAGE_SIZE}px - 10px)`}
            y={`calc(50% - ${IMAGE_SIZE/2}px`}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}/>
      </g>
    );

    let handleSelected = React.useCallback(async (index: number) => {
      if (index === exercise.variant.left + exercise.variant.right) {
        setAlreadySucceeded(true);
        await doPartialSuccess(index);
        await doSuccess();
        setAlreadySucceeded(false);
      } else {
        doFailure();
      }
    }, [exercise, partial, doSuccess, doPartialSuccess, doFailure]);
    let getFill = React.useCallback((choiceIndex: number) => {
      let fill = 'white';
      if (choiceIndex === partial) {
        fill = '#00ff0033';
      }
      return fill;
    }, [partial]);
    let choicesArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let choices = (
      <ChoiceSelector
          choices={choicesArr}
          howManyPerRow={10}
          getFill={getFill}
          onSelected={handleSelected}/>
    );

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        <g transform={`translate(0, -${IMAGE_SIZE})`}>
          {hands}
        </g>
        <g transform={`translate(0, ${IMAGE_SIZE})`}>
          {choices}
        </g>
      </Module>
    );
  };
};
