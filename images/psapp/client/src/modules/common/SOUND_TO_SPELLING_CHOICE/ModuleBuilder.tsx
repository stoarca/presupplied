import equal from 'fast-deep-equal';
import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {ProbabilisticDeck} from '@src/util';
import {LETTER_SOUNDS} from '@src/modules/common/READING/util';

import whichLetter from '@src/modules/SOUND_TO_LETTER/which_letter.wav';

// eslint-disable-next-line no-unused-vars
let soundToLetters: {[key in keyof typeof LETTER_SOUNDS]: string[]} = {
  aShortAt: ['a'],
  aShortAre: ['a', 'o'],
  aShortAnd: ['a'],
  aLong: ['a'],
  b: ['b'],
  d: ['d'],
  eShort: ['e'],
  eLong: ['e', 'y'],
  f: ['f'],
  gHard: ['g'],
  h: ['h'],
  iShort: ['i'],
  iLong: ['i', 'y'],
  j: ['j', 'g'],
  k: ['k', 'c'],
  l: ['l'],
  m: ['m'],
  n: ['n'],
  oShortOut: ['o'],
  oShortMom: ['o'],
  oLongGo: ['o'],
  oLongMore: ['o'],
  p: ['p'],
  q: ['q'],
  r: ['r'],
  s: ['s', 'c'],
  t: ['t'],
  uShortDuck: ['u'],
  uShortFull: ['u'],
  uShortCurious: ['u'],
  uLongMute: ['u'],
  uLongBlue: ['u'],
  v: ['v'],
  w: ['w'],
  x: ['x'],
  yConsonant: ['y'],
  z: ['z'],
  schwa: ['a', 'e', 'i', 'o', 'u'],
};

type Variant = keyof typeof soundToLetters;

interface MyEx extends Ex<Variant> {
}

interface ModuleBuilderProps {
  variants: readonly Variant[];
}

export let ModuleBuilder = ({ variants }: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(() => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: 2000 })), 2000), [variants]);

    let generateExercise = React.useCallback(() => {
      return {
        variant: vlist.pickVariant(),
      };
    }, [vlist]);

    let playInstructions = React.useCallback(async (exercise: MyEx) => {
      await moduleContext.playAudio(whichLetter);
      await moduleContext.playAudio(LETTER_SOUNDS[exercise.variant]);
    }, [moduleContext]);

    let {
      exercise,
      partial,
      score,
      maxScore,
      doSuccess,
      doPartialSuccess,
      doFailure,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): string[] => [],
      onPlayInstructions: playInstructions,
      playOnEveryExercise: true,
      vlist: vlist,
    });

    const correctLetters = soundToLetters[exercise.variant];

    const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const choices = React.useMemo(() => {
      const incorrectLetters = allLetters.filter(letter => !correctLetters.includes(letter));
      const shuffledIncorrect = [...incorrectLetters].sort(() => Math.random() - 0.5);

      const choiceSet = new Set([...correctLetters]);

      while (choiceSet.size < 6 && shuffledIncorrect.length > 0) {
        choiceSet.add(shuffledIncorrect.pop()!);
      }

      return [...choiceSet].sort(() => Math.random() - 0.5);
    }, [exercise.variant]);

    let handleSelected = React.useCallback(async (index: number) => {
      const selectedLetter = choices[index];

      if (correctLetters.includes(selectedLetter)) {
        if (!partial.includes(selectedLetter)) {
          let newPartial = [...partial, selectedLetter];
          await doPartialSuccess(newPartial);

          if (equal([...newPartial].sort(), [...correctLetters].sort())) {
            doSuccess();
          }
        }
      } else {
        doFailure();
      }
    }, [choices, correctLetters, partial, doSuccess, doPartialSuccess, doFailure]);

    let getFill = React.useCallback((choice: string) => {
      if (partial.includes(choice)) {
        return '#00ff0033';
      }
      return 'white';
    }, [partial]);

    return (
      <Module type="svg" score={score} maxScore={maxScore}>
        <ChoiceSelector
          choices={choices}
          howManyPerRow={6}
          getFill={getFill}
          onSelected={handleSelected}
        />
      </Module>
    );
  };
};