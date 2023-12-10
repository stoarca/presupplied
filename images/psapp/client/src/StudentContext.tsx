import React from 'react';

import {StudentDTO, KMId, ProgressStatus, StudentProgressDTO} from '../../common/types';
import {typedFetch} from './typedFetch';
import {typedLocalStorage} from './typedLocalStorage';
import {mapObject} from './util';

export class Student {
  dto: StudentDTO | null;
  constructor(dto: StudentDTO | null) {
    this.dto = dto;
  }

  progress() {
    if (this.dto) {
      return this.dto.progress;
    } else {
      let progress = typedLocalStorage.getJson('progress');
      if (!progress) {
        progress = {};
      }
      return progress;
    }
  }

  async markReached(modules: Record<KMId, ProgressStatus>) {
    if (this.dto) {
      let resp = await typedFetch({
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          modules: mapObject(modules, ([kmid, status]) => {
            return [kmid, {
              events: [{
                time: Date.now(),
                status: status,
              }],
            }];
          }),
        },
      });
    } else {
      let progress = typedLocalStorage.getJson('progress');
      if (!progress) {
        progress = {};
      }
      for (let kmid in modules) {
        let status = modules[kmid];
        if (!progress[kmid]) {
          progress[kmid] = {
            status: status,
            events: [],
          };
        }
        progress[kmid].status = status;
        progress[kmid].events.push({
          time: Date.now(),
          status: status,
        });
      }
      typedLocalStorage.setJson('progress', progress);
    }
  }

  async mergeToServer() {
    let progress = typedLocalStorage.getJson('progress') || {};
    let resp = await typedFetch({
      endpoint: '/api/learning/events',
      method: 'post',
      body: {
        modules: Object.entries(progress).reduce((acc, [kmid, entry]) => {
          if (entry.status === ProgressStatus.PASSED) {
            acc[kmid] = entry;
          }
          return acc;
        }, {} as StudentProgressDTO),
      },
    });
    if ('success' in resp) {
      typedLocalStorage.removeJson('progress');
      return;
    }
    alert('An error has occurred ' + JSON.stringify(resp));
  }
}

export let StudentContext = React.createContext<Student | null>(null);

export let useStudentContext = () => {
  let studentContext = React.useContext(StudentContext);
  if (!studentContext) {
    throw new Error('Module needs to be inside a StudentContextProvider');
  }
  return studentContext;
};
