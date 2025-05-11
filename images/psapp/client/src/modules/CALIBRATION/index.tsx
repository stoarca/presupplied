import React from 'react';

import {KMId, ProgressStatus, KNOWLEDGE_MAP} from '@src/../../common/types';
import {useUserContext} from '@src/UserContext';
import {
  ModuleBuilder, VideoLecture
} from '@src/modules/common/TEACHER_VIDEO/ModuleBuilder';
import {buildGraph} from '@src/dependency-graph';

let knowledgeGraph = buildGraph(KNOWLEDGE_MAP);

export default (props: never) => {
  let user = useUserContext();
  let bulkMarkReached = React.useCallback((modules: KMId[]) => {
    let acc: Record<KMId, ProgressStatus> = {};
    modules.forEach((kmid) => {
      acc[kmid] = ProgressStatus.PASSED;
    });
    return user.markReached(acc);
  }, [user]);
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        youtubeId: 'aHxzgJWMnUI',
        endTimeSeconds: 18,
        hideControls: true,
      },
      question: 'Can your child sing the alphabet without help?',
      choices: {
        yes: {
          exercises: [{
            preVideo: {
              youtubeId: 'aHxzgJWMnUI',
              startTimeSeconds: 19,
              endTimeSeconds: 31,
              hideControls: true,
            },
            question: 'Can your child recognize every uppercase and lowercase letter without help?',
            choices: {
              yes: {
                exercises: [{
                  preVideo: {
                    youtubeId: 'aHxzgJWMnUI',
                    startTimeSeconds: 32,
                    endTimeSeconds: 35,
                    hideControls: true,
                  },
                  question: 'Can your child read a random page out of Harry Potter without help?',
                  choices: {
                    yes: {
                      exercises: [{
                        preVideo: {
                          youtubeId: 'aHxzgJWMnUI',
                          startTimeSeconds: 36,
                          endTimeSeconds: 63,
                          hideControls: true,
                        },
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
            preVideo: {
              youtubeId: 'aHxzgJWMnUI',
              startTimeSeconds: 64,
              endTimeSeconds: 74,
              hideControls: true,
            },
            question: 'Can your child repeat at least 20 different sounds after you?',
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
                  preVideo: {
                    youtubeId: 'aHxzgJWMnUI',
                    startTimeSeconds: 75,
                    endTimeSeconds: 86,
                    hideControls: true,
                  },
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
      preVideo: {
        youtubeId: 'aHxzgJWMnUI',
        startTimeSeconds: 87,
        hideControls: true,
      },
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
