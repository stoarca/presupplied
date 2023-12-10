import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';

export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: '2TZDgDCQ1Jo',
        startTimeSeconds: 100,
      },
      question: 'Can your baby consistently make eye contact with you?',
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
