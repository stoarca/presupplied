import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {
  SIMPLE_OBJECTS, pickFromBag, genRandPoints, pointInRect, VariantList
} from '../../util';

type M = React.MouseEvent<HTMLElement>;

speechSynthesis.addEventListener('voiceschanged', () => {
  console.log(speechSynthesis.getVoices());
});

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
    console.log(vlist.variantsMap);
    let positions = genRandPoints(2, {
      paddingFromEdge: 200,
      paddingFromEachOther: 400,
    });
    let objects = pickFromBag(SIMPLE_OBJECTS, 2, {withReplacement: false});
    return {
      variant: vlist.pickVariant(),
      targets: objects.map((x, i) => ({
        ...x,
        ...positions[i],
      })),
    };
  }, []);
  let [exercise, setExercise] = React.useState(generateExercise);

  let playInstructions = React.useCallback(() => {
    let msg = exercise.variant(
      exercise.targets[0].name, exercise.targets[1].name
    );
    moduleContext.playAudio(
      '/api/tts?text=' + encodeURIComponent(msg)
    );
    console.log(msg);
  }, [moduleContext, exercise]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);
  React.useEffect(() => {
    let interval = setInterval(playInstructions, 15000);
    return () => clearInterval(interval);
  }, [playInstructions, exercise]);


  let IMAGE_SIZE = 200;
  let [needToClick, setNeedToClick] = React.useState(0);
  let [alreadyFailed, setAlreadyFailed] = React.useState(false);
  let [alreadyCompleted, setAlreadyCompleted] = React.useState(false);
  let handleClick = React.useCallback(async (e: M) => {
    if (alreadyCompleted) {
      return;
    }
    let target = exercise.targets[needToClick];
    let p = {x: e.clientX, y: e.clientY};
    let clickedCorrectImage = pointInRect(p, {
      x: target.x - IMAGE_SIZE / 2,
      y: target.y - IMAGE_SIZE / 2,
      w: IMAGE_SIZE,
      h: IMAGE_SIZE,
    });
    if (clickedCorrectImage) {
      if (needToClick === exercise.targets.length - 1) {
        setAlreadyCompleted(true);
        vlist.markSuccess(exercise.variant);
        setScore(old => old + 1);
        await moduleContext.playSharedModuleAudio('good_ding.wav');
        await moduleContext.playSharedModuleAudio('good_job.wav');
        setExercise(generateExercise());
        setNeedToClick(0);
        setAlreadyFailed(false);
        setAlreadyCompleted(false);
      } else {
        moduleContext.playSharedModuleAudio('good_ding.wav');
        setNeedToClick(needToClick + 1);
      }
    } else {
      moduleContext.playSharedModuleAudio('bad_buzzer.wav');
      if (!alreadyFailed) {
        setAlreadyFailed(true);
        vlist.markFailure(exercise.variant, 3);
        setMaxScore(old => old + 3);
      }
    }
  }, [
    moduleContext,
    exercise,
    needToClick,
    vlist,
    alreadyFailed,
    alreadyCompleted
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

  let svgStyle = {
    width: '100%',
    height: '100%',
  };
  return (
    <Module score={score}
        maxScore={maxScore}
        onClick={handleClick}>
      <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
        {targetImages}
      </svg>
    </Module>
  );
};

