import React from 'react';

import {Module} from '../../Module';
import {ModuleContext} from '../../ModuleContext';
import {
  SIMPLE_OBJECTS, pickFromBag, genRandPoints, pointInRect
} from '../../util';

type M = React.MouseEvent<HTMLElement>;

speechSynthesis.addEventListener('voiceschanged', () => {
  console.log(speechSynthesis.getVoices());
});

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let [score, setScore] = React.useState(0);
  let generateTargets = React.useCallback(() => {
    let positions = genRandPoints(2, {
      paddingFromEdge: 200,
      paddingFromEachOther: 400,
    });
    let objects = pickFromBag(SIMPLE_OBJECTS, 2, {withReplacement: false});
    return objects.map((x, i) => ({
      ...x,
      ...positions[i],
    }));
  }, []);
  let [targets, setTargets] = React.useState(generateTargets);

  let playInstructions = React.useCallback(() => {
    let n0 = targets[0].name;
    let n1 = targets[1].name;
    console.log('got here');
    let variants = [
      `Tap the ${n0}. Then tap the ${n1}.`,
      `After tapping the ${n0}, tap the ${n1}.`,
      `First, tap the ${n0}. After that, tap the ${n1}.`,
      `Tap the ${n1}, but only after tapping the ${n0}.`,
      `Tap the ${n0} before tapping the ${n1}.`,
      `Tap the ${n1}, but before that, tap the ${n0}.`,
      `First, tap the ${n0}. Next, tap the ${n1}.`,
      `Tap both the ${n0} and the ${n1}. The ${n1} should be tapped second.`,
      `Tap both the ${n1} and the ${n0}. The ${n1} should be tapped second.`,
      `Tap both the ${n0} and the ${n1}. The ${n0} should be tapped first.`,
      `Tap both the ${n1} and the ${n0}. The ${n0} should be tapped first.`,
    ];
    let msg = pickFromBag(variants, 1, {withReplacement: false})[0];
    moduleContext.playAudio(
      'http://localhost:5002/api/tts?text=' + encodeURIComponent(msg)
    );
    console.log(msg);
  }, [moduleContext, targets]);
  React.useEffect(() => {
    playInstructions();
  }, [playInstructions]);


  let IMAGE_SIZE = 200;
  let [needToClick, setNeedToClick] = React.useState(0);
  let handleClick = React.useCallback((e: M) => {
    let target = targets[needToClick];
    let p = {x: e.clientX, y: e.clientY};
    let clickedCorrectImage = pointInRect(p, {
      x: target.x - IMAGE_SIZE / 2,
      y: target.y - IMAGE_SIZE / 2,
      w: IMAGE_SIZE,
      h: IMAGE_SIZE,
    });
    if (clickedCorrectImage) {
      if (needToClick === targets.length - 1) {
        setTargets(generateTargets());
        setNeedToClick(0);
      } else {
        setNeedToClick(needToClick + 1);
      }
    } else {
      console.log('clicked the wrong thing');
    }
  }, [targets, needToClick]);

  let targetImages = targets.map(x => (
    <image key={x.name}
        href={x.image}
        x={x.x - IMAGE_SIZE / 2}
        y={x.y - IMAGE_SIZE / 2}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}/>
  ));

  let svgStyle = {
    width: '100%',
    height: '100%',
  };
  return (
    <Module score={score}
        maxScore={20}
        onClick={handleClick}>
      <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
        {targetImages}
      </svg>
    </Module>
  );
};

