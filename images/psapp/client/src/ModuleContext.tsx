import React from 'react';
import availableModules from './autogen/available-modules.json';

interface AudioOptions {
  channel?: number,
  cancelRef?: { cancelled: boolean },
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
    playAudio: (path: string, {channel = 0, cancelRef}: AudioOptions = {}) => {
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
          if (cancelInterval) {
            clearInterval(cancelInterval);
          }
          resolve();
        };
        let interval = setInterval(() => {
          if (audio.paused || audio.ended) {
            doResolve();
          }
        }, 100);

        // Set up cancellation check if cancelRef is provided
        let cancelInterval: ReturnType<typeof setInterval> | null = null;
        if (cancelRef) {
          cancelInterval = setInterval(() => {
            if (cancelRef.cancelled) {
              (audio as any).hackyPause();
              doResolve();
            }
          }, 20);
        }

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
  let Lesson = React.lazy(() => import(`/static/dist/modules/${moduleName}/index.js`));

  moduleComponents[moduleName] = (
    <ModuleContext.Provider value={buildModuleContext(moduleName)}>
      <Lesson/>
    </ModuleContext.Provider>
  );
});
