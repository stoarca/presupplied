import React from 'react';

import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';

import {
  waitPlease, badBuzzer, goodDing, goodJob
} from '@modules/common/sounds';

export interface Ex<V> {
  variant: V,
};

interface UseExerciseOptions<E extends Ex<V>, V, P> {
  onGenExercise: (previous?: E) => E,
  initialPartial: () => P,
  onPlayInstructions: (exercise: E) => Promise<void> | void,
  playOnEveryExercise: boolean,
  vlist: VariantList<V>,
}

export interface DoSuccessProps {
  sound?: string,
  waitForSound?: boolean,
}

interface DoFailureProps {
  sound?: string,
  goToNewExercise?: boolean,
}

export let useExercise = <E extends Ex<V>, V, P>({
  onGenExercise,
  initialPartial,
  onPlayInstructions,
  playOnEveryExercise,
  vlist,
}: UseExerciseOptions<E, V, P>) => {
  let moduleContext = React.useContext(ModuleContext);
  let [score, setScore] = React.useState(0);
  let [maxScore, setMaxScore] = React.useState(vlist.maxScore());
  let [exercise, setExercise] = React.useState(onGenExercise);
  let [partial, setPartial] = React.useState<P>(initialPartial);
  let [playingInstructions, setPlayingInstructions] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      setPlayingInstructions(true);
      await onPlayInstructions(exercise);
      setPlayingInstructions(false);
    })();
  }, [onPlayInstructions, moduleContext, playOnEveryExercise ? exercise : 0]);
  React.useEffect(() => {
    let interval = setInterval(() => onPlayInstructions(exercise), 15000);
    return () => clearInterval(interval);
  }, [onPlayInstructions, exercise]);

  let [alreadyFailed, setAlreadyFailed] = React.useState(false);
  let [alreadyCompleted, setAlreadyCompleted] = React.useState(false);
  let canTakeAction = React.useCallback(() => {
    if (playingInstructions) {
      moduleContext.playAudio(waitPlease, {channel: 1});
      return false;
    }
    if (alreadyCompleted) {
      return false;
    }
    return true;
  }, [moduleContext, playingInstructions, alreadyCompleted]);
  let doSuccess = React.useCallback(async ({
    sound = goodJob,
    waitForSound = true,
  }: DoSuccessProps = {}) => {
    if (!canTakeAction()) {
      return;
    }

    // TODO: what if a failure happens between the last partialSuccess and this
    // success
    setAlreadyCompleted(true);
    vlist.markSuccess(exercise.variant);
    setScore(vlist.score());
    setMaxScore(vlist.maxScore());
    let p = moduleContext.playAudio(sound);
    if (waitForSound) {
      await p;
    }
    let ex = onGenExercise(exercise);
    console.log('generated exercise');
    console.log(ex);
    if (!ex) {
      debugger;
    }
    setExercise(ex);
    setPartial(initialPartial);
    setAlreadyFailed(false);
    setAlreadyCompleted(false);
  }, [canTakeAction, moduleContext, vlist, exercise, onGenExercise]);
  let doPartialSuccess = React.useCallback(async (_partial: P, doDing=true) => {
    if (!canTakeAction()) {
      return;
    }

    setPartial(_partial);
    if (doDing) {
      await moduleContext.playAudio(goodDing);
    }
  }, [canTakeAction, moduleContext]);
  let [doingFailure, setDoingFailure] = React.useState(false);
  let doFailure = React.useCallback(async ({
    sound = badBuzzer,
    goToNewExercise = false,
  }: DoFailureProps = {}) => {
    if (!canTakeAction()) {
      return;
    }

    if (!alreadyFailed) {
      setAlreadyFailed(true);
      vlist.markFailure(exercise.variant);
      setScore(vlist.score());
      setMaxScore(vlist.maxScore());
      if (goToNewExercise) {
        let ex = onGenExercise(exercise);
        setExercise(ex);
        setPartial(initialPartial);
        setAlreadyFailed(false);
        setAlreadyCompleted(false);
      }
    }

    if (!doingFailure) {
      setDoingFailure(true);
      await moduleContext.playAudio(sound);
      setDoingFailure(false);
    }
  }, [
    canTakeAction,
    moduleContext,
    alreadyFailed,
    vlist,
    exercise,
    doingFailure
  ]);

  return {
    exercise,
    partial,
    score,
    maxScore,
    doSuccess,
    doPartialSuccess,
    doFailure,
    alreadyFailed,
  };
};

interface ModuleProps {
  children: React.ReactNode,
  score: number,
  maxScore: number,
  type: 'svg',
  extraSvgStyles?: React.CSSProperties,
  [id: string]: any,
};

export let Module: React.FC<ModuleProps> = (props) => {
  let {children, score, maxScore, type, extraSvgStyles, ...rest} = props;

  let ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    console.log(ref.current);
    let preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };
    let el = ref.current!;
    el.addEventListener('touchmove', preventDefault);
    return () => el.removeEventListener('touchmove', preventDefault);
  }, []);

  let [win, setWin] = React.useState(false);
  React.useEffect(() => {
    if (score === maxScore) {
      setWin(true);
      (async () => {
        await new Promise(r => setTimeout(r, 2000));
        let moduleVanityId = window.location.href.match(/modules\/(.*)/)![1];
        let resp = await fetch('/api/learning/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moduleVanityId: moduleVanityId,
            status: 'passed',
          }),
        });
        window.location.href = '/?scroll=' + moduleVanityId;
      })();
    }
  }, [score, maxScore]);

  let handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  let scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
    fontSize: '20px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  } as React.CSSProperties;
  let scoreEl = (
    <div style={scoreStyle}>
      Score: {score} / {maxScore}
    </div>
  );

  let containerStyle = {
    width: '100%',
    height: '100%',
    userSelect: 'none',
  } as React.CSSProperties;

  if (win) {
    let centerStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      textAlign: 'center',
    } as React.CSSProperties;
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          Win!
        </div>
        {scoreEl}
      </div>
    );
  } else if (type === 'svg') {
    let svgStyle = {
      ...extraSvgStyles,
      width: '100%',
      height: '100%',
      display: 'block',
    };
    return (
      <div style={containerStyle}
          ref={ref}
          onContextMenu={handleContextMenu}
          {...rest}>
        <svg xmlns="<http://www.w3.org/2000/svg>" style={svgStyle}>
          {children}
        </svg>
        {scoreEl}
      </div>
    );
  } else {
    return null;
  }
};
