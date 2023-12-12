import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: '-G0xX5OdeCg',
        startTimeSeconds: 129,
        hideControls: true,
      },
      question: 'Can your baby consistently repeat "aah" when prompted?',
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
