import React from 'react';

interface AudioOptions {
  channel?: number,
}

interface ModuleContextProps {
  playAudio: (path: string, options?: AudioOptions) => Promise<unknown>;
  playSharedModuleAudio:
      (filename: string, options?: AudioOptions) => Promise<unknown>;
  playModuleAudio: (filename: string, options?: AudioOptions) => Promise<unknown>;
  playTTS: (msg: string, options?: AudioOptions) => Promise<unknown>;
}

export const ModuleContext = React.createContext<ModuleContextProps>({
  playAudio: () => {throw new Error('not implemented')},
  playSharedModuleAudio: () => {throw new Error('not implemented')},
  playModuleAudio: () => {throw new Error('not implemetned')},
  playTTS: () => {throw new Error('not implemented')},
});

let channels: Array<HTMLAudioElement|null> = [null, null];
export const buildModuleContext = (moduleName: string): ModuleContextProps => {
  const ret = {
    playAudio: (path: string, {channel = 0}: AudioOptions = {}) => {
      if (channel >= channels.length) {
        throw new Error('invalid channel ' + channel);
      }
      if (channels[channel]) {
        console.log(path + ' is calling hacky pause');
        console.log(channels[channel]!.ended);
        console.log(channels[channel]!.paused);
        channels[channel]!.hackyPause();
      }
      let audio = new Audio(path);
      let playingPromise = audio.play();
      audio.hackyPause = async () => {
        console.log('calling hacky pause on ' + path);
        await playingPromise;
        console.log('waited for play, now pausing on ' + path);
        audio.pause();
      };
      channels[channel] = audio;
      return new Promise(resolve => {
        let doResolve = () => {
          clearInterval(interval);
          resolve();
        };
        let interval = setInterval(() => {
          if (audio.paused || audio.ended) {
            resolve();
          }
        }, 100);
        audio.addEventListener('paused', () => {
          console.log('received paused event on ' + path);
          console.log(audio.paused);
          console.log(audio.ended);
          doResolve();
        }, {once: true});
        audio.addEventListener('ended', () => {
          console.log('received ended event on ' + path);
          console.log(audio.paused);
          console.log(audio.ended);
          doResolve();
        }, {once: true});
      });
    },
    playSharedModuleAudio: (filename: string, options?: AudioOptions) => {
      return ret.playAudio(`/static/sounds/modules/${filename}`, options);
    },
    playModuleAudio: (filename: string, options?: AudioOptions) => {
      return ret.playAudio(
        `/static/sounds/modules/${moduleName}/${filename}`,
        options,
      );
    },
    playTTS: (msg: string, options?: AudioOptions) => {
      return ret.playAudio('/api/tts?text=' + encodeURIComponent(msg), options);
    },
  };
  return ret;
};
