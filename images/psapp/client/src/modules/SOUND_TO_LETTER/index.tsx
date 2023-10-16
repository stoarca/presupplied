import equal from 'fast-deep-equal';
import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';
import {LETTER_SOUNDS} from '@src/modules/common/READING/util';

import whichLetter from './which_letter.wav';

let soundToLetters: {[key in keyof typeof LETTER_SOUNDS]: string[]} = {
  aShort: ['a'],
  aLong: ['a'],
  aAlways: ['a', 'o'],
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
  oShort: ['o'],
  oLong: ['o'],
  p: ['p'],
  q: ['q'],
  r: ['r'],
  s: ['s', 'c'],
  t: ['t'],
  uShort: ['u'],
  uLong: ['u'],
  v: ['v'],
  w: ['w'],
  x: ['x'],
  yConsonant: ['y'],
  z: ['z'],
};

type Variant = keyof typeof soundToLetters;

interface MyEx extends Ex<Variant> {
}

let VARIANTS: Variant[] = Object.keys(soundToLetters) as Variant[];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 2), []);
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

  React.useEffect(() => {
    let listener = async (e: KeyboardEvent) => {
      let letters = soundToLetters[exercise.variant];
      if (letters.includes(e.key)) {
        if (!partial.includes(e.key)) {
          let newPartial = [...partial, e.key];
          await doPartialSuccess(newPartial);
          if (equal([...newPartial].sort(), [...letters].sort())) {
            doSuccess();
          }
        }
      } else {
        doFailure();
      }
    };
    document.addEventListener('keypress', listener);
    return () => document.removeEventListener('keypress', listener);
  }, [exercise, partial, doSuccess, doPartialSuccess, doFailure]);

  let displayArray = React.useMemo(() => {
    let letters = soundToLetters[exercise.variant];
    let ret = [...partial];
    for (let i = partial.length; i < letters.length; ++i) {
      ret.push('');
    }
    return ret;
  }, [partial, exercise]);

  let getFill = React.useCallback((str: String) => {
    if (str === '') {
      return 'white';
    }
    return '#00ff0033';
  }, []);

  let handleSelected = React.useCallback(() => {
  }, []);

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      <ChoiceSelector
          choices={displayArray}
          howManyPerRow={displayArray.length}
          getFill={getFill}
          onSelected={handleSelected}/>

    </Module>
  );
};
