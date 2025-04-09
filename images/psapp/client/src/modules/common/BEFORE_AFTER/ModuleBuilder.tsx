import React from 'react';

import { Module, useExercise, Ex } from '@src/Module';
import { ModuleContext } from '@src/ModuleContext';
import {
  SIMPLE_OBJECTS, pickFromBag, genRandPoints, VariantList,
} from '@src/util';

import {
  youAlreadyDidThatOne
} from '@modules/common/sounds';

type M = React.MouseEvent<SVGGElement>;

export type Variant = (n0: string, n1: string) => string;

interface MyEx extends Ex<Variant> {
  targets: any[],
}

interface ModuleBuilderProps {
  variants: Variant[],
  maxScorePerVariant: number,
}

export let ModuleBuilder = ({
  variants,
  maxScorePerVariant,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new VariantList(variants, maxScorePerVariant), []
    );
    let generateExercise = React.useCallback(() => {
      let positions = genRandPoints(2, {
        paddingFromEdge: 200,
        paddingFromEachOther: 400,
      });
      let objects = pickFromBag(SIMPLE_OBJECTS, 2, { withReplacement: false });
      return {
        variant: vlist.pickVariant(),
        targets: objects.map((x, i) => ({
          ...x,
          ...positions[i],
        })),
      };
    }, [vlist]);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      return moduleContext.playTTS(exercise.variant(
        exercise.targets[0].name, exercise.targets[1].name
      ));
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
      playOnEveryExercise: true,
      vlist: vlist,
    });

    let IMAGE_SIZE = 200;
    let handleClick = React.useCallback(async (e: M) => {
      if (e.button !== 0) {
        return;
      }
      let index = parseInt(e.currentTarget.getAttribute('data-index')!);
      if (index < partial) {
        moduleContext.playAudio(youAlreadyDidThatOne);
      } else if (index > partial) {
        doFailure();
      } else {
        await doPartialSuccess(partial + 1);
        if (partial === exercise.targets.length - 1) {
          doSuccess();
        }
      }
    }, [
      moduleContext,
      exercise,
      partial,
      vlist,
      doSuccess,
      doPartialSuccess,
      doFailure
    ]);

    let targetImages = exercise.targets.map((x, i) => {
      let highlight = null;
      if (i < partial) {
        let padding = 5;
        highlight = (
          <rect rx={15}
            x={x.x - IMAGE_SIZE / 2 - padding}
            y={x.y - IMAGE_SIZE / 2 - padding}
            width={IMAGE_SIZE + padding * 2}
            height={IMAGE_SIZE + padding * 2}
            fill="#ff000033" />
        );
      }
      return (
        <g key={x.name} onClick={handleClick} data-index={i}>
          <image href={x.image}
            x={x.x - IMAGE_SIZE / 2}
            y={x.y - IMAGE_SIZE / 2}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE} />
          {highlight}
        </g>
      );
    });

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        {targetImages}
      </Module>
    );
  };
};

