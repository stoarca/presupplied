import React from 'react';

import {
  UserDTO,
  KNOWLEDGE_MAP,
  KMId,
  ProgressStatus,
  ProgressVideoStatus,
  UserProgressDTO,
  UserVideoProgressDTO,
  VideoProgressDTO,
  ModuleType,
  UserType
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

  async videos(kmid: KMId): Promise<VideoProgressDTO> {
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
      return progressVideo?.[kmid] || {};
    }
  }

  async markReached(modules: Record<KMId, ProgressStatus>, onBehalfOfStudentId?: number) {
    if (this.dto) {
      const response = await typedFetch({
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
    moduleVideos: Record<KMId, Record<string, ProgressVideoStatus>>,
    onBehalfOfStudentId?: number
  ) {
    if (this.dto) {
      const moduleVideosDTO: UserVideoProgressDTO = {};
      for (const kmid in moduleVideos) {
        moduleVideosDTO[kmid] = {};
        for (const videoId in moduleVideos[kmid]) {
          moduleVideosDTO[kmid]![videoId] = {
            status: moduleVideos[kmid][videoId],
            updatedAt: new Date().toISOString()
          };
        }
      }

      const response = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'video',
          moduleVideos: moduleVideosDTO,
          onBehalfOfStudentId
        },
      });

      if ('errorCode' in response) {
        throw new Error(response.message || 'Failed to mark video as watched');
      }
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
          progressVideo[kmid]![videoVanityId] = {
            status: videos[videoVanityId],
            updatedAt: new Date().toISOString()
          };
        }
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

  separateProgressVideosByModuleType(knowledgeGraph: TechTree, progressVideos: UserVideoProgressDTO): {
    adultProgressVideos: UserVideoProgressDTO;
    childProgressVideos: UserVideoProgressDTO;
  } {
    const adultProgressVideos: UserVideoProgressDTO = {};
    const childProgressVideos: UserVideoProgressDTO = {};

    for (const [kmid, videos] of Object.entries(progressVideos)) {
      try {
        const module = knowledgeGraph.getNodeData(kmid);

        if (module.moduleType === ModuleType.ADULT_OWNED) {
          adultProgressVideos[kmid] = videos;
        } else {
          childProgressVideos[kmid] = videos;
        }
      } catch {
        console.error(`Module ${kmid} not found in knowledge graph`);
      }
    }

    return { adultProgressVideos, childProgressVideos };
  }

  private filterPassedProgress(progress: UserProgressDTO): UserProgressDTO {
    return Object.entries(progress).reduce((acc, [kmid, entry]) => {
      if (entry.status === ProgressStatus.PASSED) {
        acc[kmid] = entry;
      }
      return acc;
    }, {} as UserProgressDTO);
  }

  private async syncProgressBatch(
    modules: UserProgressDTO,
    videos: UserVideoProgressDTO,
    onBehalfOfStudentId?: number
  ): Promise<void> {
    const passedModules = this.filterPassedProgress(modules);


    if (Object.keys(passedModules).length > 0) {
      const resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'module',
          modules: passedModules,
          onBehalfOfStudentId,
        },
      });

      if (!('success' in resp)) {
        throw new Error(resp.message);
      }
    }

    if (Object.keys(videos).length > 0) {
      const resp = await typedFetch({
        host: API_HOST,
        endpoint: '/api/learning/events',
        method: 'post',
        body: {
          type: 'video',
          moduleVideos: videos,
          onBehalfOfStudentId,
        },
      });

      if (!('success' in resp)) {
        throw new Error(resp.message);
      }
    }
  }

  async mergeToServer(onBehalfOfStudentId?: number) {
    const progress = typedLocalStorage.getJson('progress') || {};
    const progressVideo = typedLocalStorage.getJson('progressVideo') || {};


    await this.syncProgressBatch(progress, progressVideo, onBehalfOfStudentId);

    typedLocalStorage.removeJson('progress');
    typedLocalStorage.removeJson('progressVideo');
  }

  async mergeSplitToServer(knowledgeGraph: TechTree, childId?: number) {
    const progress = typedLocalStorage.getJson('progress') || {};
    const progressVideo = typedLocalStorage.getJson('progressVideo') || {};

    const { adultProgress, childProgress } = this.separateProgressByModuleType(knowledgeGraph, progress);
    const { adultProgressVideos, childProgressVideos } = this.separateProgressVideosByModuleType(knowledgeGraph, progressVideo);

    // Sync adult progress to self
    if (Object.keys(adultProgress).length > 0 || Object.keys(adultProgressVideos).length > 0) {
      await this.syncProgressBatch(adultProgress, adultProgressVideos);
    }

    // Sync child progress to specified child
    if (childId && (Object.keys(childProgress).length > 0 || Object.keys(childProgressVideos).length > 0)) {
      await this.syncProgressBatch(childProgress, childProgressVideos, childId);
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
