import React from 'react';

import {Module, useInstructions} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';

import {
  VariantList,
  buildExercise,
} from '@src/util';

import {
  waitPlease, youAlreadyDidThatOne, badBuzzer, goodDing, goodJob
} from '@modules/common/sounds';

type M = React.MouseEvent<SVGRectElement>;

interface Ex {
  variant: any,
  number: number,
}

let VARIANTS = [{
  id: 'allbefore',
  f: (ex: Ex) => `Tap all the numbers that come before ${ex.number}`,
}, {
  id: 'onebefore',
  f: (ex: Ex) => `Tap the number that comes immediately before ${ex.number}`,
}, {
  id: 'previous',
  f: (ex: Ex) => `Tap the previous number`,
}, {
  id: 'allafter',
  f: (ex: Ex) => `Tap all the numbers that come after ${ex.number}`,
}, {
  id: 'oneafter',
  f: (ex: Ex) => `Tab the number that comes immediately after ${ex.number}`,
}, {
  id: 'next',
  f: (ex: Ex) => `Tap the next number`,
}];

export default (props: void) => {
  let NUMSQ = 11;
  let moduleContext = React.useContext(ModuleContext);
  let vlist = React.useMemo(() => new VariantList(VARIANTS, 5), []);
  let [score, setScore] = React.useState(0);
  let [maxScore, setMaxScore] = React.useState(VARIANTS.length * 5);
  let generateExercise = React.useCallback(() => {
    let variant = vlist.pickVariant();
    let number = Math.floor(Math.random() * 10);
    if (['allbefore', 'onebefore', 'previous'].includes(variant.id)) {
      number += 1;
    }
    return buildExercise({
      variant: variant,
      number: number,
    });
  }, [vlist]);
  let [exercise, setExercise] = React.useState(generateExercise);

  let playingInstructions = useInstructions(() => {
    return moduleContext.playTTS(exercise.variant.f(exercise));
  }, exercise, [moduleContext, exercise]);

  let [alreadyFailed, setAlreadyFailed] = React.useState(false);
  let [alreadyCompleted, setAlreadyCompleted] = React.useState(false);
  let [answers, setAnswers] = React.useState<number[]>([]);
  let handleClick = React.useCallback(async (e: M) => {
    if (playingInstructions) {
      moduleContext.playAudio(waitPlease, {channel: 1});
      return;
    }
    if (alreadyCompleted) {
      return;
    }
    if (e.button !== 0) {
      return;
    }
    let number = parseInt(e.currentTarget.getAttribute('data-number')!);
    if (answers.includes(number)) {
      moduleContext.playAudio(youAlreadyDidThatOne);
      return;
    }

    if (['allbefore', 'onebefore', 'previous'].includes(exercise.variant.id)) {
      if (number >= exercise.number) {
        moduleContext.playAudio(badBuzzer);
        if (!alreadyFailed) {
          setAlreadyFailed(true);
          vlist.markFailure(exercise.variant, 3);
          setMaxScore(old => old + 3);
        }
      } else {
        if (exercise.variant.id === 'allbefore') {
          let newAnswers = [...answers, number];
          if (newAnswers.length === exercise.number) {
            setAlreadyCompleted(true);
            vlist.markSuccess(exercise.variant);
            setScore(old => old + 1);
            setAnswers(newAnswers);
            await moduleContext.playAudio(goodDing);
            await moduleContext.playAudio(goodJob);
            let ex = generateExercise();
            setExercise(ex);
            setAnswers([]);
            setAlreadyFailed(false);
            setAlreadyCompleted(false);
          } else {
            moduleContext.playAudio(goodDing);
            setAnswers(newAnswers);
          }
        } else {
          if (number === exercise.number - 1) {
            vlist.markSuccess(exercise.variant);
            setScore(old => old + 1);
            setAnswers([number]);
            await moduleContext.playAudio(goodDing);
            await moduleContext.playAudio(goodJob);
            let ex = generateExercise();
            setExercise(ex);
            setAnswers([]);
            setAlreadyFailed(false);
            setAlreadyCompleted(false);
          } else {
            moduleContext.playAudio(badBuzzer);
            if (!alreadyFailed) {
              setAlreadyFailed(true);
              vlist.markFailure(exercise.variant, 3);
              setMaxScore(old => old + 3);
            }
          }
        }
      }
    } else if (['allafter', 'oneafter', 'next'].includes(exercise.variant.id)) {
      if (number <= exercise.number) {
        moduleContext.playAudio(badBuzzer);
        if (!alreadyFailed) {
          setAlreadyFailed(true);
          vlist.markFailure(exercise.variant, 3);
          setMaxScore(old => old + 3);
        }
      } else {
        if (exercise.variant.id === 'allafter') {
          let newAnswers = [...answers, number];
          if (newAnswers.length === NUMSQ - exercise.number - 1) {
            setAlreadyCompleted(true);
            vlist.markSuccess(exercise.variant);
            setScore(old => old + 1);
            setAnswers(newAnswers);
            await moduleContext.playAudio(goodDing);
            await moduleContext.playAudio(goodJob);
            let ex = generateExercise();
            setExercise(ex);
            setAnswers([]);
            setAlreadyFailed(false);
            setAlreadyCompleted(false);
          } else {
            moduleContext.playAudio(goodDing);
            setAnswers(newAnswers);
          }
        } else {
          if (number === exercise.number + 1) {
            vlist.markSuccess(exercise.variant);
            setScore(old => old + 1);
            setAnswers([number]);
            await moduleContext.playAudio(goodDing);
            await moduleContext.playAudio(goodJob);
            let ex = generateExercise();
            setExercise(ex);
            setAnswers([]);
            setAlreadyFailed(false);
            setAlreadyCompleted(false);
          } else {
            moduleContext.playAudio(badBuzzer);
            if (!alreadyFailed) {
              setAlreadyFailed(true);
              vlist.markFailure(exercise.variant, 3);
              setMaxScore(old => old + 3);
            }
          }
        }
      }
    } else {
      throw new Error('Unknown variant id ' + exercise.variant.id);
    }
  }, [moduleContext, exercise, playingInstructions, vlist, answers]);

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
    } else if (answers.includes(i)) {
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
