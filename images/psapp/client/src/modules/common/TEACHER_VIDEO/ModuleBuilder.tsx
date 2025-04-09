import React from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

import { Module, useWin } from '@src/Module';
import { ChoiceSelector } from '@src/ChoiceSelector2';

export interface Video {
  youtubeId: string,
  startTimeSeconds?: number,
  endTimeSeconds?: number,
  hideControls?: boolean,
}

export type FollowUpAction = {
  action: 'next' | 'wrong' | 'replay' | 'abort';
} | {
  exercises: VideoLectureExercise[],
};

export type FollowUpSideEffect = {
  sideEffect?: (() => void) | (() => Promise<void>),
};

export interface VideoLectureExercise {
  preVideo?: Video,
  question: string,
  choices: Record<string, FollowUpSideEffect & FollowUpAction>,
}

export interface VideoLecture {
  exercises: VideoLectureExercise[],
}

interface ModuleBuilderProps {
  lecture: VideoLecture;
}

// First element's choice is never used
type ExercisePath = { choice: string, index: number }[];

let getExerciseFromLecture = (
  lecture: VideoLecture, path: ExercisePath
): VideoLectureExercise => {
  let exercise = lecture.exercises[path[0].index];
  for (let i = 1; i < path.length; ++i) {
    let choiceObj = exercise.choices[path[i].choice];
    if (!('exercises' in choiceObj)) {
      throw new Error('This path is invalid for the lecture');
    }
    let exercises = choiceObj.exercises;
    if (!exercises) {
      throw new Error('This path is invalid for the lecture');
    }
    exercise = exercises[path[i].index];
  }
  return exercise;
};
let getNextExercisePath = (
  lecture: VideoLecture, path: ExercisePath
): ExercisePath | null => {
  // TODO: inefficient
  let pathAttempt = [...path];
  for (let i = pathAttempt.length - 1; i >= 0; --i) {
    pathAttempt[i].index += 1;
    if (!!getExerciseFromLecture(lecture, pathAttempt)) {
      return pathAttempt;
    }
    pathAttempt.pop();
  }
  return null;
};

export let ModuleBuilder = ({ lecture }: ModuleBuilderProps) => {

  let [exercisePath, setExercisePath] = React.useState<ExercisePath>(
    [{ choice: '', index: 0 }]
  );
  let exercise = React.useMemo(() => {
    return getExerciseFromLecture(lecture, exercisePath);
  }, [lecture, exercisePath]);
  let [sawVideo, setSawVideo] = React.useState(false);

  let { win, doWin } = useWin();

  let handleVideoStateChange = React.useCallback((event: YouTubeEvent) => {
    if (event.data === 0) { // data === 0 means video finished playing
      setSawVideo(true);
    }
  }, []);
  let getFill = React.useCallback(() => {
    return 'white';
  }, []);
  let advance = React.useCallback(() => {
    let newPath = getNextExercisePath(lecture, exercisePath);
    if (newPath == null) {
      doWin();
    } else {
      setExercisePath(newPath);
      setSawVideo(false);
    }
  }, [lecture, exercisePath, doWin]);
  let handleSelected = React.useCallback(async (choice: string) => {
    let choiceObj = exercise.choices[choice];
    if (choiceObj.sideEffect) {
      await choiceObj.sideEffect();
    }
    if ('action' in choiceObj) {
      if (choiceObj.action === 'next') {
        advance();
      } else if (choiceObj.action === 'wrong') {
        // TODO: some sort of buzzer sound?
      } else if (choiceObj.action === 'replay') {
        // TODO: implement
      } else if (choiceObj.action === 'abort') {
        window.location.href = '/';
      }
    } else {
      setExercisePath([...exercisePath, { choice: choice, index: 0 }]);
      setSawVideo(false);
    }
  }, [exercisePath, exercise, advance]);

  if (win) {
    return win;
  }

  if (!sawVideo && exercise.preVideo) {
    let embedId = exercise.preVideo.youtubeId;
    let opts: YouTubeProps['opts'] = {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        start: exercise.preVideo.startTimeSeconds,
        end: exercise.preVideo.endTimeSeconds,
        controls: exercise.preVideo.hideControls ? 0 : 1,
      },
    };
    return (
      <YouTube
        className="youtube100"
        videoId={embedId}
        opts={opts}
        onStateChange={handleVideoStateChange} />
    );
  } else {
    let choices = Object.keys(exercise.choices);
    return (
      <Module type="div" score={0} maxScore={1} hideScore={true}>
        <ChoiceSelector question={exercise.question}
          howManyPerRow={2}
          choices={choices}
          choiceWidth={300}
          getFill={getFill}
          onSelected={handleSelected}
        />
      </Module>
    );
  }
};
