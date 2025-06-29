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
  const urlParams = new URLSearchParams(window.location.search);
  const childId = urlParams.get('childId');

  const getChildProgress = React.useCallback(() => {
    if (childId && user.dto?.children) {
      const child = user.dto.children.find(c => c.id === parseInt(childId));
      if (child && child.progress) {
        return child.progress;
      }
    }
    return user.progress();
  }, [childId, user]);

  let bulkMarkReached = React.useCallback((modules: KMId[]) => {
    let acc: Record<KMId, ProgressStatus> = {};
    modules.forEach((kmid) => {
      acc[kmid] = ProgressStatus.PASSED;
    });
    return user.markReachedSplit(knowledgeGraph, acc, childId ? parseInt(childId) : undefined);
  }, [user, childId]);
  let lecture: VideoLecture = {
    exercises: [{
      preVideo: {
        videoId: 'CALIBRATION_INTRO',
        hideControls: true,
      },
      question: 'Can your child sing the alphabet without help?',
      choices: {
        yes: {
          sideEffect: () => {
            let modules = Array.from(new Set([
              'SING_ALPHABET',
              ...knowledgeGraph.dependenciesOf('SING_ALPHABET'),
            ]));
            return bulkMarkReached(modules);
          },
          exercises: [{
            preVideo: {
              videoId: 'CALIBRATION_LETTER_RECOGNITION',
              hideControls: true,
            },
            question: 'Can your child recognize every uppercase and lowercase letter without help?',
            choices: {
              yes: {
                sideEffect: () => {
                  let modules = Array.from(new Set([
                    'READ_LETTERS',
                    ...knowledgeGraph.dependenciesOf('READ_LETTERS'),
                  ]));
                  return bulkMarkReached(modules);
                },
                exercises: [{
                  preVideo: {
                    videoId: 'CALIBRATION_RANDOM_HARRY_POTTER_PAGE',
                    hideControls: true,
                  },
                  question: 'Can your child read a random page out of Harry Potter without help?',
                  choices: {
                    yes: {
                      sideEffect: () => {
                        let modules = Array.from(new Set([
                          'READ_PICTURE_BOOKS',
                          ...knowledgeGraph.dependenciesOf('READ_PICTURE_BOOKS'),
                        ]));
                        return bulkMarkReached(modules);
                      },
                      action: 'next',
                    },
                    no: {
                      action: 'next',
                    },
                  },
                }],
              },
              no: {
                action: 'next',
              },
            },
          }],
        },
        no: {
          exercises: [{
            preVideo: {
              videoId: 'CALIBRATION_REPEAT_SOUNDS',
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
                    videoId: 'CALIBRATION_TRACKING',
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
      question: 'Can your child do a pincer grasp (pick up small objects with thumb and forefinger)?',
      skipIf: () => {
        let currentProgress = getChildProgress();
        return currentProgress['PINCER_GRASP']?.status === ProgressStatus.PASSED;
      },
      choices: {
        yes: {
          sideEffect: () => {
            let modules = Array.from(new Set([
              'PINCER_GRASP',
              ...knowledgeGraph.dependenciesOf('PINCER_GRASP'),
            ]));
            return bulkMarkReached(modules);
          },
          action: 'next',
        },
        no: {
          action: 'next',
        },
      },
    }, {
      question: 'Can your child count to 20 without help?',
      skipIf: () => {
        let currentProgress = getChildProgress();
        return currentProgress['COUNT_TO_20']?.status === ProgressStatus.PASSED;
      },
      choices: {
        yes: {
          sideEffect: () => {
            let modules = Array.from(new Set([
              'COUNT_TO_20',
              ...knowledgeGraph.dependenciesOf('COUNT_TO_20'),
            ]));
            return bulkMarkReached(modules);
          },
          action: 'next',
        },
        no: {
          action: 'next',
        },
      },
    }, {
      preVideo: {
        videoId: 'CALIBRATION_ADVANCED_READER',
        hideControls: true,
      },
      question: 'Your child is doing great! Our curriculum has nothing to offer you at this time. Would you like us to send you an email when we add other subjects?',
      skipIf: () => {
        let currentProgress = getChildProgress();
        return !(
          currentProgress['READ_PICTURE_BOOKS']?.status === ProgressStatus.PASSED &&
          currentProgress['PINCER_GRASP']?.status === ProgressStatus.PASSED &&
          currentProgress['COUNT_TO_20']?.status === ProgressStatus.PASSED
        );
      },
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
    }, {
      preVideo: {
        videoId: 'CALIBRATION_FINAL',
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
