import React from 'react';

interface ModuleContextProps {
  playAudio: (path: string) => void;
  playSharedModuleAudio: (filename: string) => void;
  playModuleAudio: (filename: string) => void;
}

export const ModuleContext = React.createContext<ModuleContextProps>({
  playAudio: () => {throw new Error('not implemented')},
  playSharedModuleAudio: () => {throw new Error('not implemented')},
  playModuleAudio: () => {throw new Error('not implemetned')},
});

let currentlyPlayingAudio: HTMLAudioElement | null = null;
export const buildModuleContext = (moduleName: string): ModuleContextProps => {
  const ret = {
    playAudio: (path: string) => {
      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
      }
      currentlyPlayingAudio = new Audio(path);
      return currentlyPlayingAudio.play();
    },
    playSharedModuleAudio: (filename: string) => {
      return ret.playAudio(`/static/sounds/modules/${filename}`);
    },
    playModuleAudio: (filename: string) => {
      return ret.playAudio(`/static/sounds/modules/${moduleName}/${filename}`);
    },
  };
  return ret;
};
