import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, Point, genRandPoints, pickFromBag} from '@src/util';
import {
  VisualFractionType, VisualFractionTypes, VisualFraction
} from '@src/VisualFraction';
import {
  BadVisualFractionTypes, BadVisualFraction
} from '@src/BadVisualFraction';

type M = React.MouseEvent<SVGElement>;

type Variant = number;

interface MyEx extends Ex<Variant> {
  positions: Point[];
  t: VisualFractionType;
  wrongDenom: number;
  tw: VisualFractionType;
}

let VARIANTS: Variant[] = [1, 2, 3, 4, 5, 6, 7];

let denomMap: {[key: Variant]: string} = {
  1: 'whole',
  2: 'half',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
};

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS.map(v => ({ variant: v, millicards: 1000 })), 5), []);
  let generateExercise = React.useCallback(() => {
    let positions = genRandPoints(3, {
      paddingFromEdge: 100,
      paddingFromEachOther: 400,
    });
    let variant = vlist.pickVariant();
    let t: VisualFractionType;
    if (variant >= 3) {
      t = pickFromBag(VisualFractionTypes, 1, {
        withReplacement: false,
      })[0];
    } else {
      t = pickFromBag(VisualFractionTypes.filter(x => x !== 'regular'), 1, {
        withReplacement: false,
      })[0];
    }

    let wrongDenom = pickFromBag(VARIANTS.filter(x => x !== variant), 1, {
      withReplacement: false,
    })[0];
    let tw: VisualFractionType;
    if (wrongDenom >= 3) {
      tw = pickFromBag(VisualFractionTypes, 1, {
        withReplacement: false,
      })[0];
    } else {
      tw = pickFromBag(VisualFractionTypes.filter(x => x !== 'regular'), 1, {
        withReplacement: false,
      })[0];
    }

    let tb = pickFromBag(BadVisualFractionTypes, 1, {
      withReplacement: false,
    })[0];


    return {
      variant: variant,
      positions: positions,
      t: t,
      wrongDenom: wrongDenom,
      tw: tw,
      tb: tb,
    };
  }, [vlist]);
  let playInstructions = React.useCallback((ex: MyEx) => {
    moduleContext.playTTS('Tap one ' + denomMap[ex.variant]);
  }, [moduleContext]);
  let {
    exercise,
    score,
    maxScore,
    doSuccess,
    doFailure,
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: () => 0,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: true,
    vlist: vlist,
  });

  let handleSuccess = React.useCallback((e: M) => {
    doSuccess();
  }, [doSuccess]);

  let handleFailure = React.useCallback((e: M) => {
    doFailure();
  }, [doFailure]);

  let SIZE = 200;
  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      <g transform={`translate(
            ${exercise.positions[0].x - SIZE / 2},
            ${exercise.positions[0].y - SIZE / 2}
          )`}
      onClick={handleSuccess}>
        <VisualFraction
          type={exercise.t}
          size={SIZE}
          color="#ff0000"
          numerator={1}
          denominator={exercise.variant}/>
      </g>
      <g transform={`translate(
            ${exercise.positions[1].x - SIZE / 2},
            ${exercise.positions[1].y - SIZE / 2}
          )`}
      onClick={handleFailure}>
        <VisualFraction
          type={exercise.tw}
          size={SIZE}
          color="#ff0000"
          numerator={1}
          denominator={exercise.wrongDenom}/>
      </g>
      <g transform={`translate(
            ${exercise.positions[2].x - SIZE / 2},
            ${exercise.positions[2].y - SIZE / 2}
          )`}
      onClick={handleFailure}>
        <BadVisualFraction
          type={exercise.tb}
          size={SIZE}
          color="#ff0000"
          numerator={1}
          denominator={exercise.variant}/>
      </g>
    </Module>
  );
};

