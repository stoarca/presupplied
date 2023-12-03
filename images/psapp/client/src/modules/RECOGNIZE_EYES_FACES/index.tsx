import React from 'react';

import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';

export default (props: never) => {
  let lecture: VideoLecture = {
    snippets: [{
      youtubeId: '2TZDgDCQ1Jo',
      startTimeSeconds: 100,
      exercises: [{
        question: 'Can your baby consistently make eye contact with you?',
        choices: ['yes', 'no'],
        answerIndex: 0,
      }],
    }],
  };
  return (
    <ModuleBuilder lecture={lecture}/>
  );
};
