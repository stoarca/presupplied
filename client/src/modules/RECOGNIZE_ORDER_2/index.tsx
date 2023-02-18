import React from 'react';

import {Module, useInstructions} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {
  SIMPLE_OBJECTS,
  pickFromBag,
  genRandPoints,
  pointInRect,
  VariantList,
  buildExercise,
} from '@src/util';

// LOH: move sounds to proper assets and make them more engaging for the
// win condition

type M = React.MouseEvent<HTMLElement>;

let VARIANTS: { (n0: string, n1: string): string }[] = [
  (n0, n1) => `Tap the ${n0}. Then tap the ${n1}.`,
  (n0, n1) => `After tapping the ${n0}, tap the ${n1}.`,
  (n0, n1) => `First, tap the ${n0}. After that, tap the ${n1}.`,
  (n0, n1) => `Tap the ${n1}, but only after tapping the ${n0}.`,
  (n0, n1) => `Tap the ${n0} before tapping the ${n1}.`,
  (n0, n1) => `Tap the ${n1}, but before that, tap the ${n0}.`,
  (n0, n1) => `First, tap the ${n0}. Next, tap the ${n1}.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n1} should be tapped second.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n1} should be tapped second.`,
  (n0, n1) => `Tap both the ${n0} and the ${n1}. The ${n0} should be tapped first.`,
  (n0, n1) => `Tap both the ${n1} and the ${n0}. The ${n0} should be tapped first.`,
];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 3), []);
  let [score, setScore] = React.useState(0);
  let [maxScore, setMaxScore] = React.useState(VARIANTS.length * 3);
  let generateExercise = React.useCallback(() => {
    let positions = genRandPoints(2, {
      paddingFromEdge: 200,
      paddingFromEachOther: 400,
    });
    let objects = pickFromBag(SIMPLE_OBJECTS, 2, {withReplacement: false});
    return buildExercise({
      variant: vlist.pickVariant(),
      targets: objects.map((x, i) => ({
        ...x,
        ...positions[i],
      })),
    });
  }, []);
  let [exercise, setExercise] = React.useState(generateExercise);

  let playingInstructions = useInstructions(() => {
    return moduleContext.playTTS(exercise.variant(
      exercise.targets[0].name, exercise.targets[1].name
    ));
  }, exercise, [moduleContext, exercise]);

  let IMAGE_SIZE = 200;
  let [needToClick, setNeedToClick] = React.useState(0);
  let [alreadyFailed, setAlreadyFailed] = React.useState(false);
  let [alreadyCompleted, setAlreadyCompleted] = React.useState(false);
  let handleClick = React.useCallback(async (e: M) => {
    if (playingInstructions) {
      moduleContext.playSharedModuleAudio('wait_please.wav', {channel: 1});
      return;
    }
    if (alreadyCompleted) {
      return;
    }
    if (e.button !== 0) {
      return;
    }
    let p = {x: e.clientX, y: e.clientY};
    for (let i = 0; i < exercise.targets.length; ++i) {
      let target = exercise.targets[i];
      let clickedIt = pointInRect(p, {
        x: target.x - IMAGE_SIZE / 2,
        y: target.y - IMAGE_SIZE / 2,
        w: IMAGE_SIZE,
        h: IMAGE_SIZE,
      });
      if (!clickedIt) {
        continue;
      }
      if (i < needToClick) {
        moduleContext.playSharedModuleAudio('you_already_did_that_one.wav');
      } else if (i > needToClick) {
        moduleContext.playSharedModuleAudio('bad_buzzer.wav');
        if (!alreadyFailed) {
          setAlreadyFailed(true);
          vlist.markFailure(exercise.variant, 3);
          setMaxScore(old => old + 3);
        }
      } else {
        if (needToClick === exercise.targets.length - 1) {
          setAlreadyCompleted(true);
          vlist.markSuccess(exercise.variant);
          setScore(old => old + 1);
          console.log(
            'about to congratulate on ' +
                exercise.targets.map(x => x.name)
          );
          await moduleContext.playSharedModuleAudio('good_ding.wav');
          console.log('done ding');
          await moduleContext.playSharedModuleAudio('good_job.wav');
          console.log('done good job');
          let ex = generateExercise();
          console.log(ex);
          setExercise(ex);
          setNeedToClick(0);
          setAlreadyFailed(false);
          setAlreadyCompleted(false);
        } else {
          moduleContext.playSharedModuleAudio('good_ding.wav');
          setNeedToClick(needToClick + 1);
        }
      }
    }
  }, [
    moduleContext,
    exercise,
    needToClick,
    vlist,
    alreadyFailed,
    alreadyCompleted,
    playingInstructions,
  ]);

  let targetImages = exercise.targets.map((x, i) => {
    let highlight = null;
    if (i < needToClick || alreadyCompleted) {
      let padding = 5;
      highlight = (
        <rect rx={15}
            x={x.x - IMAGE_SIZE / 2 - padding}
            y={x.y - IMAGE_SIZE / 2 - padding}
            width={IMAGE_SIZE + padding * 2}
            height={IMAGE_SIZE + padding * 2}
            fill="#ff000033"/>
      );
    }
    return (
      <g key={x.name}>
        <image href={x.image}
            x={x.x - IMAGE_SIZE / 2}
            y={x.y - IMAGE_SIZE / 2}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}/>
        {highlight}
      </g>
    );
  });

  return (
    <Module type="svg" score={score} maxScore={maxScore} onClick={handleClick}>
      {targetImages}
    </Module>
  );
};

