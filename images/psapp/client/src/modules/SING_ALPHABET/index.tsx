import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';


export default (props: never) => {
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        videoId: 'SING_ALPHABET_QUESTION',
        hideControls: true,
      },
      question: 'Can your child consistently sing the alphabet without making mistakes?',
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
