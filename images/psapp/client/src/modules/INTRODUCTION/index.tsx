import React from 'react';

import {ModuleBuilder} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';

export default (props: never) => {
  let lecture = {
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
