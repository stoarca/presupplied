import React from 'react';
import {LETTER_SOUNDS, BIGRAM_SOUNDS} from './util';
import {withAbort} from '@src/util';
import {ModuleContext} from '@src/ModuleContext';

export type SoundMapping = readonly (readonly [number, keyof typeof LETTER_SOUNDS | keyof typeof BIGRAM_SOUNDS])[];

export interface PronunciationOptions {
  moduleContext: React.ContextType<typeof ModuleContext>;
  sounds: SoundMapping;
  word: string;
  spokenAudio?: string;
  isSingleSound?: boolean;
  onPositionChange?: (position: [number, number]) => void;
  signal: AbortSignal;
}

export const analyzeSounds = (word: string): SoundMapping => {
  if (!word) {
    return [];
  }

  const sounds: [number, keyof typeof LETTER_SOUNDS | keyof typeof BIGRAM_SOUNDS][] = [];
  let i = 0;

  while (i < word.length) {
    let foundBigram = false;

    if (i < word.length - 1) {
      const bigram = word.substring(i, i + 2).toLowerCase();
      if (bigram in BIGRAM_SOUNDS) {
        sounds.push([i, bigram as keyof typeof BIGRAM_SOUNDS]);
        i += 2;
        foundBigram = true;
      }
    }

    if (!foundBigram) {
      const letter = word[i].toLowerCase();
      if (letter in LETTER_SOUNDS) {
        sounds.push([i, letter as keyof typeof LETTER_SOUNDS]);
      }
      i += 1;
    }
  }

  return sounds;
};

export const pronounceStepByStep = async ({
  moduleContext,
  sounds,
  word,
  spokenAudio,
  isSingleSound = false,
  onPositionChange,
  signal
}: PronunciationOptions): Promise<void> => {
  for (let i = 0; i < sounds.length; ++i) {
    const startPos = sounds[i][0];
    let lastPos;
    if (i === sounds.length - 1) {
      lastPos = word.length;
    } else {
      lastPos = sounds[i + 1][0];
    }

    if (onPositionChange) {
      onPositionChange([startPos, lastPos]);
    }

    const sound = sounds[i][1];
    if (sound in LETTER_SOUNDS) {
      await withAbort(() => moduleContext.playAudio(
        LETTER_SOUNDS[sound as keyof typeof LETTER_SOUNDS]
      ), signal);
    } else {
      await withAbort(() => moduleContext.playAudio(
        BIGRAM_SOUNDS[sound as keyof typeof BIGRAM_SOUNDS]
      ), signal);
    }

    if (sounds.length > 6) {
      await withAbort(() => new Promise(r => setTimeout(r, 50)), signal);
    } else if (sounds.length > 4) {
      await withAbort(() => new Promise(r => setTimeout(r, 250)), signal);
    } else {
      await withAbort(() => new Promise(r => setTimeout(r, 500)), signal);
    }
  }

  if (onPositionChange) {
    onPositionChange([0, word.length]);
  }

  if (!isSingleSound) {
    if (spokenAudio) {
      await withAbort(
        () => moduleContext.playAudio(spokenAudio),
        signal
      );
    } else {
      await withAbort(
        () => moduleContext.playTTS(word.toLowerCase()),
        signal
      );
    }
  }

  if (onPositionChange) {
    onPositionChange([0, 0]);
  }

};
