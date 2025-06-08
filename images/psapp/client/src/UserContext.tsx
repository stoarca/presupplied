import React from 'react';

import {
  UserDTO,
  KNOWLEDGE_MAP,
  KMId,
  ProgressStatus,
  ProgressVideoStatus,
  UserProgressDTO,
  VideoProgressDTO,
  ModuleType,
  UserType,
  VideoId
} from '../../common/types';
import { TechTree } from './dependency-graph';
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
      // For anonymous users, just trigger update to re-render components
      if (this.onUpdate) {
        this.onUpdate(null);
      }
      return;
    }

    try {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/user',
        method: 'get'
      });

      this.dto = response.user;
      if (this.onUpdate) {
        this.onUpdate(this.dto);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
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

  videos(kmid: KMId): VideoProgressDTO {
    if (this.dto) {
      const moduleNode = KNOWLEDGE_MAP.nodes.find(node => node.id === kmid);
      if (!moduleNode) {
        throw new Error(`Module ${kmid} not found in knowledge map`);
      }

      const relevantVideoIds = [...moduleNode.studentVideos, ...moduleNode.teacherVideos];
      const filteredProgress: VideoProgressDTO = {};

      for (const videoId of relevantVideoIds) {
        if (this.dto.videoProgress[videoId]) {
          filteredProgress[videoId] = this.dto.videoProgress[videoId];
        }
      }

      return filteredProgress;
    } else {
      let progressVideo = typedLocalStorage.getJson('progressVideo') || {};

      const moduleNode = KNOWLEDGE_MAP.nodes.find(node => node.id === kmid);
      if (!moduleNode) {
        throw new Error(`Module ${kmid} not found in knowledge map`);
      }

      const relevantVideoIds = [...moduleNode.studentVideos, ...moduleNode.teacherVideos];
      const filteredProgress: VideoProgressDTO = {};

      for (const videoId of relevantVideoIds) {
        if (progressVideo[videoId]) {
          filteredProgress[videoId] = progressVideo[videoId];
        }
      }

      return filteredProgress;
    }
  }

  async markReached(modules: Record<KMId, ProgressStatus>, onBehalfOfStudentId?: number) {
    if (this.dto) {
      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/module_progress',
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
          onBehalfOfStudentId
        },
      });

      if ('errorCode' in response) {
        if (response.errorCode === 'learning.event.invalidModules') {
          throw new Error(
            response.message + JSON.stringify(response.moduleVanityIds)
          );
        }
        throw new Error(response.message);
      }
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

    await this.refreshUser();
  }

  async markWatched(
    videos: Record<VideoId, ProgressVideoStatus>,
    onBehalfOfStudentId?: number
  ) {
    if (this.dto) {
      const videosDTO: VideoProgressDTO = {};
      for (const videoId in videos) {
        videosDTO[videoId] = {
          status: videos[videoId],
          updatedAt: new Date().toISOString()
        };
      }

      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/video_progress',
        method: 'post',
        body: {
          videos: videosDTO,
          onBehalfOfStudentId
        },
      });

      if ('errorCode' in response) {
        throw new Error(response.message || 'Failed to mark video as watched');
      }
    } else {
      let progressVideo: VideoProgressDTO = typedLocalStorage.getJson('progressVideo') || {};

      for (const videoId in videos) {
        progressVideo[videoId] = {
          status: videos[videoId],
          updatedAt: new Date().toISOString()
        };
      }
      typedLocalStorage.setJson('progressVideo', progressVideo);
    }

    await this.refreshUser();
  }

  hasLocalProgress(): boolean {
    const progress = typedLocalStorage.getJson('progress');
    const progressVideo = typedLocalStorage.getJson('progressVideo');
    return (progress !== null && Object.keys(progress).length > 0) ||
           (progressVideo !== null && Object.keys(progressVideo).length > 0);
  }

  isSelfManaged(): boolean {
    return !this.dto || this.dto.type !== UserType.STUDENT || !this.dto.adults || this.dto.adults.length === 0;
  }

  separateProgressByModuleType(knowledgeGraph: TechTree, progress: UserProgressDTO): {
    adultProgress: UserProgressDTO;
    childProgress: UserProgressDTO;
  } {
    const adultProgress: UserProgressDTO = {};
    const childProgress: UserProgressDTO = {};

    for (const [kmid, entry] of Object.entries(progress)) {
      try {
        const module = knowledgeGraph.getNodeData(kmid);

        if (module.moduleType === ModuleType.ADULT_OWNED) {
          adultProgress[kmid] = entry;
        } else {
          childProgress[kmid] = entry;
        }
      } catch {
        console.error(`Module ${kmid} not found in knowledge graph`);
      }
    }

    return { adultProgress, childProgress };
  }


  private filterPassedProgress(progress: UserProgressDTO): UserProgressDTO {
    return Object.entries(progress).reduce((acc, [kmid, entry]) => {
      if (entry.status === ProgressStatus.PASSED) {
        acc[kmid] = entry;
      }
      return acc;
    }, {} as UserProgressDTO);
  }

  async mergeToServer(onBehalfOfStudentId?: number) {
    const progress = typedLocalStorage.getJson('progress') || {};
    const progressVideo = typedLocalStorage.getJson('progressVideo') || {};

    const passedModules = this.filterPassedProgress(progress);

    if (Object.keys(passedModules).length > 0) {
      const resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/module_progress',
        method: 'post',
        body: {
          modules: mapObject(passedModules, ([kmid, entry]) => {
            return [kmid, {
              events: entry.events,
            }];
          }),
          onBehalfOfStudentId,
        },
      });

      if ('errorCode' in resp) {
        throw new Error(resp.message);
      }
    }

    if (Object.keys(progressVideo).length > 0) {
      const videosDTO: VideoProgressDTO = {};
      for (const videoId in progressVideo) {
        const videoEntry = progressVideo[videoId];
        videosDTO[videoId] = {
          status: videoEntry.status,
          updatedAt: videoEntry.updatedAt
        };
      }

      const resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/video_progress',
        method: 'post',
        body: {
          videos: videosDTO,
          onBehalfOfStudentId,
        },
      });

      if ('errorCode' in resp) {
        throw new Error(resp.message);
      }
    }

    typedLocalStorage.removeJson('progress');
    typedLocalStorage.removeJson('progressVideo');
  }

  async mergeSplitToServer(knowledgeGraph: TechTree, childId?: number) {
    const progress = typedLocalStorage.getJson('progress') || {};
    const progressVideo = typedLocalStorage.getJson('progressVideo') || {};

    const { adultProgress, childProgress } = this.separateProgressByModuleType(knowledgeGraph, progress);

    if (Object.keys(adultProgress).length > 0) {
      const passedAdultModules = this.filterPassedProgress(adultProgress);
      if (Object.keys(passedAdultModules).length > 0) {
        const resp = await typedFetch({
          host: API_HOST,
          endpoint: '/api/learning/module_progress',
          method: 'post',
          body: {
            modules: mapObject(passedAdultModules, ([kmid, entry]) => {
              return [kmid, {
                events: entry.events,
              }];
            }),
          },
        });

        if ('errorCode' in resp) {
          throw new Error(resp.message);
        }
      }
    }

    if (childId && Object.keys(childProgress).length > 0) {
      const passedChildModules = this.filterPassedProgress(childProgress);
      if (Object.keys(passedChildModules).length > 0) {
        const resp = await typedFetch({
          host: API_HOST,
          endpoint: '/api/learning/module_progress',
          method: 'post',
          body: {
            modules: mapObject(passedChildModules, ([kmid, entry]) => {
              return [kmid, {
                events: entry.events,
              }];
            }),
            onBehalfOfStudentId: childId,
          },
        });

        if ('errorCode' in resp) {
          throw new Error(resp.message);
        }
      }
    }

    if (Object.keys(progressVideo).length > 0) {
      const videosDTO: VideoProgressDTO = {};
      for (const videoId in progressVideo) {
        const videoEntry = progressVideo[videoId];
        videosDTO[videoId] = {
          status: videoEntry.status,
          updatedAt: videoEntry.updatedAt
        };
      }

      if (childId) {
        const resp = await typedFetch({
          host: API_HOST,
          endpoint: '/api/learning/video_progress',
          method: 'post',
          body: {
            videos: videosDTO,
            onBehalfOfStudentId: childId,
          },
        });

        if ('errorCode' in resp) {
          throw new Error(resp.message);
        }
      } else {
        const resp = await typedFetch({
          host: API_HOST,
          endpoint: '/api/learning/video_progress',
          method: 'post',
          body: {
            videos: videosDTO,
          },
        });

        if ('errorCode' in resp) {
          throw new Error(resp.message);
        }
      }
    }

    typedLocalStorage.removeJson('progress');
    typedLocalStorage.removeJson('progressVideo');
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
