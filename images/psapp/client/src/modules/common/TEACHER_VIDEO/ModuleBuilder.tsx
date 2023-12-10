import React from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

import {Module, useWin} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ChoiceSelector} from '@src/ChoiceSelector2';

export interface VideoLectureExercise {
  question: string,
  choices: string[],
  answerIndex: number,
}

export interface VideoLectureSnippet {
  youtubeId: string,
  startTimeSeconds?: number,
  endTimeSeconds?: number,
  exercises: VideoLectureExercise[],
}

export interface VideoLecture {
  snippets: VideoLectureSnippet[],
}

interface ModuleBuilderProps {
  lecture: VideoLecture;
}

export let ModuleBuilder = ({lecture}: ModuleBuilderProps) => {
  let moduleContext = React.useContext(ModuleContext);

  let [snippetIndex, setSnippetIndex] = React.useState(0);
  let snippet = lecture.snippets[snippetIndex];
  let [partial, setPartial] = React.useState(-1);

  let {win, doWin} = useWin();

  let advance = React.useCallback(() => {
    if (partial === snippet.exercises.length - 1) {
      if (snippetIndex === lecture.snippets.length - 1) {
        doWin();
      } else {
        setSnippetIndex(x => x + 1);
        setPartial(-1);
      }
    } else {
      setPartial(x => x + 1);
    }
  }, [snippet, partial, doWin]);
  let handleVideoStateChange = React.useCallback((event: YouTubeEvent) => {
    if (event.data === 0) { // data === 0 means video finished playing
      advance();
    }
  }, [advance]);
  let getFill = React.useCallback(() => {
    return 'white';
  }, []);
  let handleSelected = React.useCallback((index: number) => {
    if (snippet.exercises[partial].answerIndex === index) {
      advance();
    } else {
      // TODO: what to do when parent gets the "wrong" answer?
    }
  }, [snippet, advance]);

  if (win) {
    return win;
  }

  if (partial === -1) {
    let embedId = snippet.youtubeId;
    let opts: YouTubeProps['opts'] = {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        start: snippet.startTimeSeconds,
        end: snippet.endTimeSeconds,
        controls: 1,
      },
    };
    return (
      <YouTube
          className="youtube100"
          videoId={embedId}
          opts={opts}
          onStateChange={handleVideoStateChange}/>
    );
  } else {
    let choices = snippet.exercises[partial].choices;
    return (
      <Module type="div" score={0} maxScore={1} hideScore={true}>
        <ChoiceSelector question={snippet.exercises[partial].question}
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
