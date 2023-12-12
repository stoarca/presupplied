import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: '_TUN9auJXKE',
        startTimeSeconds: 54,
        endTimeSeconds: 63,
        hideControls: true,
      },
      question: 'Can your baby consistently string together various vowels and consonants?',
      choices: {
        yes: {
          action: 'next',
        },
        no: {
          action: 'abort',
        },
      },
    }],
  };
  return (
    <ModuleBuilder lecture={lecture}/>
  );
};
