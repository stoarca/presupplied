import React from 'react';

import {
  UserDTO,
  KNOWLEDGE_MAP,
  KMId,
  ProgressStatus,
  ProgressVideoStatus,
  UserProgressDTO
} from '../../common/types';
import { typedFetch, API_HOST } from './typedFetch';
import { typedLocalStorage } from './typedLocalStorage';
import { mapObject } from './util';

export class User {
  dto: UserDTO | null;
  onUpdate: ((dto: UserDTO | null) => void) | null = null;

  constructor(dto: UserDTO | null) {
    this.dto = dto;
  }

  async refreshUser() {
    if (!this.dto) {
      return;
    }

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/users/:id',
        method: 'get',
        params: { id: String(this.dto.id) }
      });

      if ('user' in response) {
        this.dto = response.user;
        if (this.onUpdate) {
          this.onUpdate(this.dto);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
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
    let ret: UserProgressDTO = {};
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

  async markReached(modules: Record<KMId, ProgressStatus>, onBehalfOfStudentId?: number) {
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
          onBehalfOfStudentId
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
    moduleVideos: Record<KMId, Record<string, ProgressVideoStatus>>,
    onBehalfOfStudentId?: number
  ) {
    if (this.dto) {
      await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'video',
          moduleVideos: moduleVideos,
          onBehalfOfStudentId
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
        }, {} as UserProgressDTO),
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

export let UserContext = React.createContext<User | null>(null);

export let useUserContext = () => {
  let userContext = React.useContext(UserContext);
  if (!userContext) {
    throw new Error('Component needs to be inside a UserContextProvider');
  }
  return userContext;
};
