import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: '7sNtpcKpRYU',
      },
      question: 'Did you watch the video?',
      choices: {
        yes: {
          action: 'next',
        },
        no: {
          action: 'replay',
        },
      },
    }],
  };
  return (
    <ModuleBuilder lecture={lecture}/>
  );
};
