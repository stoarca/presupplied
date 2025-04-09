import React from 'react';
import availableModules from './autogen/available-modules.json';

interface AudioOptions {
  channel?: number,
}

export interface ModuleContextProps {
  playAudio: (path: string, options?: AudioOptions) => Promise<void>;
  playTTS: (msg: string, options?: AudioOptions) => Promise<void>;
}

export let ModuleContext = React.createContext<ModuleContextProps>({
  playAudio: () => {throw new Error('not implemented');},
  playTTS: () => {throw new Error('not implemented');},
});

let channels: Array<HTMLAudioElement|null> = [null, null];
let buildModuleContext = (moduleName: string): ModuleContextProps => {
  let ret = {
    playAudio: (path: string, {channel = 0}: AudioOptions = {}) => {
      if (channel >= channels.length) {
        throw new Error('invalid channel ' + channel);
      }
      if (channels[channel]) {
        (channels[channel]! as any).hackyPause();
      }
      let audio = new Audio(path);
      let playingPromise = audio.play();
      (audio as any).hackyPause = async () => {
        await playingPromise;
        audio.pause();
      };
      channels[channel] = audio;
      return new Promise<void>(resolve => {
        let doResolve = () => {
          clearInterval(interval);
          resolve();
        };
        let interval = setInterval(() => {
          if (audio.paused || audio.ended) {
            doResolve();
          }
        }, 100);
        audio.addEventListener('paused', () => {
          doResolve();
        }, {once: true});
        audio.addEventListener('ended', () => {
          doResolve();
        }, {once: true});
      });
    },
    playTTS: (msg: string, options?: AudioOptions) => {
      return ret.playAudio('/api/tts?text=' + encodeURIComponent(msg), options);
    },
  };
  return ret;
};

export let moduleComponents: {[id: string]: React.ReactElement} = {};

availableModules.forEach(moduleName => {
  let Lesson = React.lazy(() => import(
    /* webpackChunkName: 'modules/[request]' */
    /* webpackInclude: /index\.tsx$/ */
    /* webpackExclude: /\/common\// */
    './modules/' + moduleName
  ));

  moduleComponents[moduleName] = (
    <ModuleContext.Provider value={buildModuleContext(moduleName)}>
      <Lesson/>
    </ModuleContext.Provider>
  );
});
