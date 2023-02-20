import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';

import {VariantList} from '@src/util';

import {youAlreadyDidThatOne} from '@modules/common/sounds';

type M = React.MouseEvent<SVGRectElement>;

interface Variant {
  id: string,
  f: (ex: MyEx) => string,
}

interface MyEx extends Ex<Variant> {
  number: number,
}

let VARIANTS: Variant[] = [{
  id: 'allbefore',
  f: (ex) => `Tap all the numbers that come before ${ex.number}.`,
}, {
  id: 'onebefore',
  f: (ex) => `Tap the number that comes immediately before ${ex.number}.`,
}, {
  id: 'previous',
  f: (ex) => `We're at ${ex.number}. Tap the previous number.`,
}, {
  id: 'allafter',
  f: (ex) => `Tap all the numbers that come after ${ex.number}.`,
}, {
  id: 'oneafter',
  f: (ex) => `Tap the number that comes immediately after ${ex.number}.`,
}, {
  id: 'next',
  f: (ex) => `We're at ${ex.number}. Tap the next number.`,
}];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 5), []);
  let generateExercise = React.useCallback(() => {
    let variant = vlist.pickVariant();
    let number = Math.floor(Math.random() * 10);
    if (['allbefore', 'onebefore', 'previous'].includes(variant.id)) {
      number += 1;
    }
    return {
      variant: variant,
      number: number,
    };
  }, [vlist]);
  let playInstructions = React.useCallback((exercise: MyEx) => {
    return moduleContext.playTTS(exercise.variant.f(exercise));
  }, [moduleContext]);
  let {
    exercise,
    partial,
    score,
    maxScore,
    doSuccess,
    doPartialSuccess,
    doFailure
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: (): number[] => [],
    onPlayInstructions: playInstructions,
    playOnEveryExercise: true,
    vlist: vlist,
  });

  let NUMSQ = 11;
  let handleClick = React.useCallback(async (e: M) => {
    if (e.button !== 0) {
      return;
    }
    let number = parseInt(e.currentTarget.getAttribute('data-number')!);
    if (partial.includes(number)) {
      moduleContext.playAudio(youAlreadyDidThatOne);
      return;
    }

    if (['allbefore', 'onebefore', 'previous'].includes(exercise.variant.id)) {
      if (number >= exercise.number) {
        doFailure();
      } else {
        if (exercise.variant.id === 'allbefore') {
          let newPartial = [...partial, number];
          if (newPartial.length === exercise.number) {
            await doPartialSuccess(newPartial);
            doSuccess();
          } else {
            doPartialSuccess(newPartial);
          }
        } else {
          if (number === exercise.number - 1) {
            await doPartialSuccess([number]);
            doSuccess();
          } else {
            doFailure();
          }
        }
      }
    } else if (['allafter', 'oneafter', 'next'].includes(exercise.variant.id)) {
      if (number <= exercise.number) {
        doFailure();
      } else {
        if (exercise.variant.id === 'allafter') {
          let newPartial = [...partial, number];
          await doPartialSuccess(newPartial);
          if (newPartial.length === NUMSQ - exercise.number - 1) {
            doSuccess();
          }
        } else {
          if (number === exercise.number + 1) {
            await doPartialSuccess([number]);
            doSuccess();
          } else {
            doFailure();
          }
        }
      }
    } else {
      throw new Error('Unknown variant id ' + exercise.variant.id);
    }
  }, [
    moduleContext, exercise, partial, doSuccess, doPartialSuccess, doFailure
  ]);

  let SQLEN = 100;
  let SQPAD = 10;
  let startX = (window.innerWidth - (SQLEN + SQPAD) * NUMSQ) / 2;
  let textStyle = {
    fontFamily: 'sans-serif',
    fontSize: '80px',
    pointerEvents: 'none',
  } as React.CSSProperties;
  let choices = [];
  for (let i = 0; i < NUMSQ; ++i) {
    let x = startX + i * (SQLEN + SQPAD) + SQPAD / 2;
    let fill = "white";
    if (i === exercise.number) {
      fill = "#0000ff33";
    } else if (partial.includes(i)) {
      fill = "#00ff0033";
    }
    choices.push(
      <g key={'answer_' + i} transform={`translate(${x}, ${-SQLEN / 2})`}>
        <rect data-number={i}
            x="0"
            y="50%"
            width={SQLEN}
            height={SQLEN}
            rx={10}
            fill={fill}
            stroke="black"
            strokeWidth="5px"
            onClick={handleClick}/>
        <text style={textStyle}
            dominantBaseline="central"
            textAnchor="middle"
            transform={`translate(${SQLEN / 2}, ${SQLEN / 2})`}
            y="50%">
          {i}
        </text>
      </g>
    );
  }
  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      {choices}
    </Module>
  );
}
