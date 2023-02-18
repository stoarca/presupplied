import React from 'react';

interface AudioOptions {
  channel?: number,
}

interface ModuleContextProps {
  playAudio: (path: string, options?: AudioOptions) => Promise<void>;
  playSharedModuleAudio:
      (filename: string, options?: AudioOptions) => Promise<void>;
  playModuleAudio: (filename: string, options?: AudioOptions) => Promise<void>;
  playTTS: (msg: string, options?: AudioOptions) => Promise<void>;
}

export const ModuleContext = React.createContext<ModuleContextProps>({
  playAudio: () => {throw new Error('not implemented')},
  playSharedModuleAudio: () => {throw new Error('not implemented')},
  playModuleAudio: () => {throw new Error('not implemetned')},
  playTTS: () => {throw new Error('not implemented')},
});

console.log('doing this thing');
console.log(require.context('../../static/sounds', true, /.*/, 'weak').keys());

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
        (channels[channel]! as any).hackyPause();
      }
      let audio = new Audio(path);
      let playingPromise = audio.play();
      (audio as any).hackyPause = async () => {
        console.log('calling hacky pause on ' + path);
        await playingPromise;
        console.log('waited for play, now pausing on ' + path);
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
