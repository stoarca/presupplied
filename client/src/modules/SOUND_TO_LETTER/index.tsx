import equal from 'fast-deep-equal';
import React from 'react';

import {ChoiceSelector} from '@src/ChoiceSelector';
import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList} from '@src/util';

import whichLetter from './which_letter.wav';

import aShort from './a_short.wav';
import aLong from './a_long.wav';
import aAlways from './a_always.wav';
import b from './b.wav';
// intentionally no c, use k or s instead
import d from './d.wav';
import eShort from './e_short.wav';
import eLong from './e_long.wav';
import f from './f.wav';
import gHard from './g_hard.wav';
import h from './h.wav';
import iShort from './i_short.wav';
import iLong from './i_long.wav';
import j from './j.wav';
import k from './k.wav';
import l from './l.wav';
import m from './m.wav';
import n from './n.wav';
import oShort from './o_short.wav';
import oLong from './o_long.wav';
import p from './p.wav';
import q from './q.wav';
import r from './r.wav';
import s from './s.wav';
import t from './t.wav';
import uShort from './u_short.wav';
import uLong from './u_long.wav';
import v from './v.wav';
import w from './w.wav';
import x from './x.wav';
import yConsonant from './y_consonant.wav';
import z from './z.wav';

let sounds = {
  aShort: aShort,
  aLong: aLong,
  aAlways: aAlways,
  b: b,
  d: d,
  eShort: eShort,
  eLong: eLong,
  f: f,
  gHard: gHard,
  h: h,
  iShort: iShort,
  iLong: iLong,
  j: j,
  k: k,
  l: l,
  m: m,
  n: n,
  oShort: oShort,
  oLong: oLong,
  p: p,
  q: q,
  r: r,
  s: s,
  t: t,
  uShort: uShort,
  uLong: uLong,
  v: v,
  w: w,
  x: x,
  yConsonant: yConsonant,
  z: z,
};

let soundToLetters: {[key in keyof typeof sounds]: string[]} = {
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

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 3), []);
  let generateExercise = React.useCallback(() => {
    return {
      variant: vlist.pickVariant(),
    };
  }, [vlist]);
  let playInstructions = React.useCallback(async (exercise: MyEx) => {
    await moduleContext.playAudio(whichLetter);
    await moduleContext.playAudio(sounds[exercise.variant]);
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
