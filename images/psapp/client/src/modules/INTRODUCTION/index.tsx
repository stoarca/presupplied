import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    snippets: [{
      youtubeId: '7sNtpcKpRYU',
      exercises: [{
        question: 'Did you watch the video?',
        choices: ['yes', 'no'],
        answerIndex: 0,
      }],
    }],
  };
  return (
    <ModuleBuilder lecture={lecture}/>
  );
};
