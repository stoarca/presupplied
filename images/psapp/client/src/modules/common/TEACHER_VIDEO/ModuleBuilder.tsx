import React from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

import { Module } from '@src/Module';
import { ChoiceSelector } from '@src/ChoiceSelector2';
import { useUserContext } from '@src/UserContext';
import { ProgressVideoStatus, getVideoById } from '@src/../../../common/types';

export interface Video {
  videoId: string,
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
  skipIf?: () => boolean,
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
): VideoLectureExercise | null => {
  if (!lecture.exercises[path[0].index]) {
    return null;
  }
  let exercise = lecture.exercises[path[0].index];
  for (let i = 1; i < path.length; ++i) {
    let choiceObj = exercise.choices[path[i].choice];
    if (!('exercises' in choiceObj)) {
      throw new Error(
        'This path is invalid for the lecture ' + JSON.stringify(path)
      );
    }
    let exercises = choiceObj.exercises;
    if (!exercises) {
      throw new Error('Could not find exercises ' + JSON.stringify(path));
    }
    if (!exercises[path[i].index]) {
      return null;
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
    while (true) {
      pathAttempt[i].index += 1;
      let exercise = getExerciseFromLecture(lecture, pathAttempt);
      if (exercise) {
        if (exercise.skipIf && exercise.skipIf()) {
          // Continue to next index at same level
          continue;
        }
        return pathAttempt;
      }
      break;
    }
    pathAttempt.pop();
  }

  return null;
};

export let ModuleBuilder = ({ lecture }: ModuleBuilderProps) => {
  const user = useUserContext();

  let [exercisePath, setExercisePath] = React.useState<ExercisePath>(
    [{ choice: '', index: 0 }]
  );
  let exercise = React.useMemo(() => {
    const ex = getExerciseFromLecture(lecture, exercisePath);
    return ex;
  }, [lecture, exercisePath]);
  let [sawVideo, setSawVideo] = React.useState(false);
  let [forceRewatch, setForceRewatch] = React.useState(false);

  let [win, setWin] = React.useState(false);

  let handleVideoStateChange = React.useCallback(async (event: YouTubeEvent) => {
    if (event.data === 0 && exercise?.preVideo) { // data === 0 means video finished playing
      setSawVideo(true);
      setForceRewatch(false);

      const videoId = exercise.preVideo.videoId;
      await user.markWatched({
        [videoId]: ProgressVideoStatus.WATCHED
      });
    }
  }, [exercise?.preVideo, user]);
  let getFill = React.useCallback(() => {
    return 'white';
  }, []);
  let advance = React.useCallback(() => {
    let newPath = getNextExercisePath(lecture, exercisePath);
    if (newPath == null) {
      setWin(true);
    } else {
      setExercisePath(newPath);
      setSawVideo(false);
      setForceRewatch(false);
    }
  }, [lecture, exercisePath]);
  let handleSelected = React.useCallback(async (choice: string) => {
    if (!exercise) {
      return;
    }
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
      setForceRewatch(false);
    }
  }, [exercisePath, exercise, advance]);

  const videoProgress = user.videoProgress();
  const shouldShowVideo = exercise?.preVideo &&
    (forceRewatch || (!sawVideo && (!videoProgress[exercise.preVideo.videoId] ||
     videoProgress[exercise.preVideo.videoId].status !== ProgressVideoStatus.WATCHED)));

  if (!exercise) {
    return (
      <Module type="div" score={1} maxScore={1} hideScore={true}>
        <div />
      </Module>
    );
  }

  if (shouldShowVideo && exercise.preVideo) {
    const videoData = getVideoById(exercise.preVideo.videoId);
    if (!videoData) {
      console.error(`Video ${exercise.preVideo.videoId} not found in videos.json`);
      setSawVideo(true);
      return null;
    }

    const youtubeId = videoData.url.match(/watch\?v=([^&]+)/)?.[1] || '';

    let opts: YouTubeProps['opts'] = {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        start: videoData.startTimeSeconds,
        end: videoData.endTimeSeconds,
        controls: exercise.preVideo.hideControls ? 0 : 1,
      },
    };
    return (
      <YouTube
        className="youtube100"
        videoId={youtubeId}
        opts={opts}
        onStateChange={handleVideoStateChange} />
    );
  } else {
    let choices = Object.keys(exercise.choices);
    return (
      <Module type="div" score={win ? 1 : 0} maxScore={1} hideScore={true}>
        <ChoiceSelector question={exercise.question}
          howManyPerRow={2}
          choices={choices}
          choiceWidth={300}
          getFill={getFill}
          onSelected={handleSelected}
        />
        {exercise?.preVideo && (
          <button
            onClick={() => {
              setForceRewatch(true);
              setSawVideo(false);
            }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#3B3B3B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 1000
            }}
          >
            Rewatch Video
          </button>
        )}
      </Module>
    );
  }
};
