import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: 'V_t5WtG_MNY',
        startTimeSeconds: 48,
      },
      question: 'Can your baby keep his/her head up for more than 10 seconds?',
      choices: {
        yes: {
          action: 'next',
        },
        no: {
          action: 'abort',
        },
      },
    }, {
      question: 'Can your baby focus on an object in front of him/her while holding his/her head up?',
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
