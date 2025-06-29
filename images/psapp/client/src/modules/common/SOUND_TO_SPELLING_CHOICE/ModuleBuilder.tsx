import equal from 'fast-deep-equal';
import React from 'react';

import {ModuleBuilder as ChoiceModuleBuilder, ChoiceItem, MyEx} from '@modules/common/CHOICE/ModuleBuilder';
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

interface ModuleBuilderProps {
  variants: readonly Variant[];
}

export let ModuleBuilder = ({ variants }: ModuleBuilderProps) => {
  return () => {
    const moduleContext = React.useContext(ModuleContext);
    const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const vlist = React.useMemo(() => new ProbabilisticDeck(variants.map(v => ({ variant: v, millicards: 2000 })), 2000), [variants]);

    const generateChoices = React.useCallback((variant: Variant) => {
      const correctLetters = soundToLetters[variant];
      const incorrectLetters = allLetters.filter(letter => !correctLetters.includes(letter));
      const shuffledIncorrect = [...incorrectLetters].sort(() => Math.random() - 0.5);

      const choiceSet = new Set([...correctLetters]);

      while (choiceSet.size < 6 && shuffledIncorrect.length > 0) {
        choiceSet.add(shuffledIncorrect.pop()!);
      }

      return [...choiceSet].sort(() => Math.random() - 0.5);
    }, []);

    const playInstructions = React.useCallback(async (exercise: MyEx<Variant>, cancelRef: { cancelled: boolean }) => {
      await moduleContext.playAudio(whichLetter, { cancelRef });
      await moduleContext.playAudio(LETTER_SOUNDS[exercise.variant], { cancelRef });
    }, [moduleContext]);

    const isCorrectChoice = React.useCallback((choice: ChoiceItem, exercise: MyEx<Variant>) => {
      const correctLetters = soundToLetters[exercise.variant];
      return correctLetters.includes(choice as string);
    }, []);

    const initialPartial = React.useCallback(() => [] as string[], []);

    const buildPartialAnswer = React.useCallback((currentPartial: string[], selectedChoice: ChoiceItem, exercise: MyEx<Variant>) => {
      const currentPartialStrings = currentPartial as string[];
      const selectedString = selectedChoice as string;

      if (currentPartialStrings.includes(selectedString)) {
        return currentPartial;
      }

      return [...currentPartialStrings, selectedString];
    }, []);

    const isPartialComplete = React.useCallback((partial: string[], exercise: MyEx<Variant>) => {
      const correctLetters = soundToLetters[exercise.variant];
      const partialStrings = partial as string[];
      return equal([...partialStrings].sort(), [...correctLetters].sort());
    }, []);

    const getFill = React.useCallback((choice: ChoiceItem, exercise: MyEx<Variant>, partial: string[], alreadyFailed: boolean) => {
      const correctLetters = soundToLetters[exercise.variant];
      const partialStrings = partial as string[];

      if (partialStrings.includes(choice as string)) {
        return 'correct';
      }

      if (alreadyFailed && correctLetters.includes(choice as string)) {
        return 'wrong';
      }

      return 'white';
    }, []);

    return <ChoiceModuleBuilder
      vlist={vlist}
      generateChoices={generateChoices}
      playInstructions={playInstructions}
      isCorrectChoice={isCorrectChoice}
      initialPartial={initialPartial}
      buildPartialAnswer={buildPartialAnswer}
      isPartialComplete={isPartialComplete}
      getFill={getFill}
      howManyPerRow={6}
      playOnEveryExercise={true}
    />;
  };
};