import React from 'react';

import {KMId, ProgressStatus, KNOWLEDGE_MAP} from '@src/../../common/types';
import {useStudentContext} from '@src/StudentContext';
import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';
import {buildGraph} from '@src/dependency-graph';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export default (props: never) => {
  let student = useStudentContext();
  let bulkMarkReached = React.useCallback((modules: KMId[]) => {
    let acc: Record<KMId, ProgressStatus> = {};
    modules.forEach((kmid) => {
      acc[kmid] = ProgressStatus.PASSED;
    });
    return student.markReached(acc);
  }, [student]);
  let lecture: VideoLecture = {
    exercises: [{
      //preVideo: {
      //  // CALIBRATION - introduce calibration
      //  youtubeId: 'TODO',
      //},
      question: 'Can your child sing the alphabet without help?',
      choices: {
        yes: {
          exercises: [{
            question: 'Can your child recognize every uppercase and lowercase letter without help?',
            choices: {
              yes: {
                exercises: [{
                  question: 'Can your child read a random page out of Harry Potter without help?',
                  choices: {
                    yes: {
                      exercises: [{
                        question: 'Your child is doing great! Our curriculum has nothing to offer you at this time. Would you like us to send you an email when we add other subjects?',
                        choices: {
                          yes: {
                            sideEffect: () => {
                              // TODO: Add an attribute to Moment so we can look
                              // them up later
                            },
                            action: 'next',
                          },
                          no: {
                            sideEffect: () => {
                              // TODO: redirect somewhere
                            },
                            action: 'next',
                          },
                        },
                      }],
                    },
                    no: {
                      sideEffect: () => {
                        // recognize letters,
                        // but probably cannot sound the letters
                        let modules = Array.from(new Set([
                          'READ_LETTERS',
                          ...knowledgeGraph.dependenciesOf('READ_LETTERS'),
                          'SING_ALPHABET',
                          ...knowledgeGraph.dependenciesOf('SING_ALPHABET'),
                        ]));
                        return bulkMarkReached(modules);
                      },
                      action: 'next',
                    },
                  },
                }],
              },
              no: {
                sideEffect: () => {
                  // can sing the alphabet, but not recognize letters
                  let modules = Array.from(new Set([
                    'SING_ALPHABET',
                    ...knowledgeGraph.dependenciesOf('SING_ALPHABET'),
                  ]));
                  return bulkMarkReached(modules);
                },
                action: 'next',
              },
            },
          }],
        },
        no: {
          exercises: [{
            question: 'Can your child repeat at least 30 different sounds after you?',
            choices: {
              yes: {
                sideEffect: () => {
                  // can repeat sounds, but cannot sing the alphabet.
                  let modules = Array.from(new Set([
                    'REPEAT_SOUNDS',
                    ...knowledgeGraph.dependenciesOf('REPEAT_SOUNDS'),
                  ]));
                  return bulkMarkReached(modules);
                },
                action: 'next',
              },
              no: {
                exercises: [{
                  question: 'Can your child follow sounds and objects with their eyes?',
                  choices: {
                    yes: {
                      sideEffect: () => {
                        // can follow sounds and objects, but not repeat sounds
                        let modules = Array.from(new Set([
                          'TRACKING_SOUND',
                          ...knowledgeGraph.dependenciesOf('TRACKING_SOUND'),
                          'TRACKING_OBJECTS',
                          ...knowledgeGraph.dependenciesOf('TRACKING_OBJECTS'),
                        ]));
                        return bulkMarkReached(modules);
                      },
                      action: 'next',
                    },
                    no: {
                      sideEffect: () => {
                        // start from the beginning
                        // intentionally empty
                      },
                      action: 'next',
                    },
                  },
                }],
              }
            }
          }],
        },
      },
    }, {
      //preVideo: {
      //  // UI_TUTORIAL - teach them about optional videos
      //  youtubeId: 'TODO',
      //},
      question: 'Do you have to watch every single video?',
      choices: {
        yes: {
          action: 'wrong',
        },
        no: {
          action: 'next',
        },
      },
    }],
  };
  return (
    <ModuleBuilder lecture={lecture}/>
  );
};
