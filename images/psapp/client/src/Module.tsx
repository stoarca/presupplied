import React from 'react';

import {ModuleContext} from '@src/ModuleContext';
import {useUserContext} from '@src/UserContext';
import {ProbabilisticDeck} from '@src/util';
import {
  ProgressStatus, InputTrainingEvent, TrainingEvent
} from '../../common/types';
import {typedFetch, API_HOST} from './typedFetch';

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
  vlist: ProbabilisticDeck<V>,
}

export interface DoSuccessProps {
  sound?: string,
  waitForSound?: boolean,
}

interface DoFailureProps {
  sound?: string,
  goToNewExercise?: boolean,
}

let blobToBase64 = (blob: Blob): Promise<string> =>{
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (e) => reject(fileReader.error);
    fileReader.onloadend = (e) => {
      const dataUrl = fileReader.result as string;
      // remove "data:mime/type;base64," prefix from data url
      const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve(base64);
    };
    fileReader.readAsDataURL(blob);
  });
};

export let useTrainingDataRecorder = () => {
  let recorder = React.useRef<{
    microphone: MediaRecorder,
    events: TrainingEvent[],
  }>();

  let id = React.useMemo(() => {
    return Date.now() + '-' + crypto.randomUUID();
  }, []);

  let addEvent = React.useCallback((event: InputTrainingEvent) => {
    if (!recorder.current) {
      console.warn('ignoring training event');
      console.warn(event);
      return;
    }
    recorder.current.events.push({
      ...event,
      time: new Date(),
    });
  }, []);

  React.useEffect(() => {
    let unmounted = false;
    let sequenceId = 0;
    let handleDataAvailable = async (e: BlobEvent) => {
      let sid = sequenceId++;
      let events = recorder.current!.events;
      recorder.current!.events = [];
      await typedFetch({
        host: API_HOST,
        endpoint: '/api/training/events',
        method: 'post',
        body: {
          id: id,
          sequenceId: sid,
          webmSoundB64: await blobToBase64(e.data),
          events: events,
        },
      });
    };
    (async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (unmounted) {
          return;
        }
        console.log('setting media recorder');
        let m = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 64000,
        });
        console.log(m.audioBitsPerSecond);
        recorder.current = {
          microphone: m,
          events: [],
        };
        m.addEventListener('dataavailable', handleDataAvailable);
        m.start(5000);
        addEvent({status: 'microphoneStart'});
      }
    })();
    return () => {
      console.log('unmounted');
      unmounted = true;
      if (recorder.current) {
        recorder.current.microphone.stop();
        recorder.current.microphone.removeEventListener(
          'dataavailable', handleDataAvailable
        );
      }
    };
  }, [addEvent]);

  return {
    addEvent: addEvent,
  };
};

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

export let useWin = () => {
  let user = useUserContext();

  let [win, setWin] = React.useState(false);

  let doWin = React.useCallback(() => {
    setWin(true);
    (async () => {
      let kmid = window.location.pathname.match(/modules\/([^/?]+)/)![1];
      const urlParams = new URLSearchParams(window.location.search);
      const childId = urlParams.get('childId');

      if (childId) {
        await user.markReached({[kmid]: ProgressStatus.PASSED}, parseInt(childId));
      } else {
        await user.markReached({[kmid]: ProgressStatus.PASSED});
      }

      await new Promise(r => setTimeout(r, 2000));
      window.location.href = '/?scroll=' + kmid;
    })();
  }, [user]);

  let element;
  if (win) {
    let centerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      textAlign: 'center',
    };
    element = (
      <div style={centerStyle}>
        Win!
      </div>
    );
  } else {
    element = null;
  }

  return {win: element, doWin: doWin};
};

interface ModuleProps {
  children: React.ReactNode,
  score: number,
  maxScore: number,
  type: 'svg' | 'div',
  extraSvgStyles?: React.CSSProperties,
  hideScore?: boolean,
  [id: string]: any,
};

export let Module: React.FC<ModuleProps> = (props) => {
  let {
    children, score, maxScore, type, extraSvgStyles, hideScore, ...rest
  } = props;

  let ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };
    let el = ref.current!;
    el.addEventListener('touchmove', preventDefault);
    return () => el.removeEventListener('touchmove', preventDefault);
  }, []);

  let {win, doWin} = useWin();
  React.useEffect(() => {
    // Using >= instead of === to account for potential small discrepancies in millicards
    if (score >= maxScore) {
      doWin();
    }
  }, [score, maxScore, doWin]);

  let handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (win) {
    return win;
  }

  let scoreStyle = {
    position: 'fixed',
    top: 10,
    right: 10,
    fontSize: '20px',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  } as React.CSSProperties;
  let scoreEl;
  if (hideScore) {
    scoreEl = null;
  } else {
    scoreEl = (
      <div style={scoreStyle}>
        Score: {Math.floor(score / 1000)} / {Math.floor(maxScore / 1000)}
      </div>
    );
  }

  let containerStyle = {
    width: '100%',
    height: '100%',
    userSelect: 'none',
  } as React.CSSProperties;

  if (type === 'svg') {
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
  } else if (type === 'div') {
    let divStyle = {
      width: '100%',
      height: '100%',
    };
    return (
      <div style={containerStyle}
        ref={ref}
        onContextMenu={handleContextMenu}
        {...rest}>
        <div style={divStyle}>
          {children}
        </div>
        {scoreEl}
      </div>
    );
  } else {
    throw new Error('Unrecognized type ' + type);
  }
};
