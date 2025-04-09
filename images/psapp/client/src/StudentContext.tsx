import React from 'react';

import {
  StudentDTO,
  KNOWLEDGE_MAP,
  KMId,
  ProgressStatus,
  ProgressVideoStatus,
  StudentProgressDTO
} from '../../common/types';
import { typedFetch, API_HOST } from './typedFetch';
import { typedLocalStorage } from './typedLocalStorage';
import { mapObject } from './util';

export class Student {
  dto: StudentDTO | null;
  constructor(dto: StudentDTO | null) {
    this.dto = dto;
  }

  _progress() {
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

  progress() {
    let raw = this._progress();
    let modulesThatExistToday = new Set(KNOWLEDGE_MAP.nodes.map(x => x.id));
    let ret: StudentProgressDTO = {};
    for (let k in raw) {
      if (modulesThatExistToday.has(k)) {
        ret[k] = raw[k];
      } else {
        console.error('Unexpected module in progress list: ' + k);
      }
    }
    return ret;
  }

  async videos(kmid: KMId): Promise<Record<string, ProgressVideoStatus>> {
    if (this.dto) {
      let resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/progressvideos/:kmid',
        method: 'get',
        params: {
          kmid: kmid,
        },
      });
      if ('success' in resp) {
        return resp.videos;
      }
      throw new Error(JSON.stringify(resp));
    } else {
      let progressVideo = typedLocalStorage.getJson('progressVideo');

      return progressVideo && progressVideo[kmid] || {};
    }
  }

  async markReached(modules: Record<KMId, ProgressStatus>) {
    if (this.dto) {
      await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'module',
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

  async markWatched(
    moduleVideos: Record<KMId, Record<string, ProgressVideoStatus>>
  ) {
    if (this.dto) {
      await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'video',
          moduleVideos: moduleVideos,
        },
      });
    } else {
      let progressVideo = typedLocalStorage.getJson('progressVideo');
      if (!progressVideo) {
        progressVideo = {};
      }

      for (let kmid in moduleVideos) {
        if (!progressVideo[kmid]) {
          progressVideo[kmid] = {};
        }

        let videos = moduleVideos[kmid];
        for (let videoVanityId in videos) {
          progressVideo[kmid][videoVanityId] = videos[videoVanityId];
        }
      }
      typedLocalStorage.setJson('progressVideo', progressVideo);
    }
  }

  async mergeToServer() {
    let progress = typedLocalStorage.getJson('progress') || {};
    let resp = await typedFetch({
      host: API_HOST,
      endpoint: '/api/learning/events',
      method: 'post',
      body: {
        type: 'module',
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
    } else {
      alert('An error has occurred ' + JSON.stringify(resp)); // eslint-disable-line no-alert
      return;
    }

    let progressVideo = typedLocalStorage.getJson('progressVideo') || {};
    resp = await typedFetch({
      host: API_HOST,
      endpoint: '/api/learning/events',
      method: 'post',
      body: {
        type: 'video',
        moduleVideos: progressVideo,
      },
    });
    if ('success' in resp) {
      typedLocalStorage.removeJson('progressVideo');
    } else {
      alert('An error has occurred ' + JSON.stringify(resp));// eslint-disable-line no-alert
      return;
    }
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
