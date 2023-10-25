import aShortAt from './a_short_at.wav';
import aShortAre from './a_short_are.wav';
import aShortAnd from './a_short_and.wav';
import aLong from './a_long.wav';
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
import oShortOut from './o_short_out.wav';
import oShortMom from './o_short_mom.wav';
import oLongGo from './o_long_go.wav';
import oLongMore from './o_long_more.wav';
import p from './p.wav';
import q from './q.wav';
import r from './r.wav';
import s from './s.wav';
import t from './t.wav';
import uShortDuck from './u_short_duck.wav';
import uShortFull from './u_short_full.wav';
import uShortCurious from './u_short_curious.wav';
import uLongMute from './u_long_mute.wav';
import uLongBlue from './u_long_blue.wav';
import v from './v.wav';
import w from './w.wav';
import x from './x.wav';
import yConsonant from './y_consonant.wav';
import z from './z.wav';
import schwa from './schwa.wav';

export let LETTER_SOUNDS = {
  aShortAt: aShortAt,
  aShortAre: aShortAre,
  aShortAnd: aShortAnd,
  aLong: aLong,
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
  oShortOut: oShortOut,
  oShortMom: oShortMom,
  oLongGo: oLongGo,
  oLongMore: oLongMore,
  p: p,
  q: q,
  r: r,
  s: s,
  t: t,
  uShortDuck: uShortDuck,
  uShortFull: uShortFull,
  uShortCurious: uShortCurious,
  uLongMute: uLongMute,
  uLongBlue: uLongBlue,
  v: v,
  w: w,
  x: x,
  yConsonant: yConsonant,
  z: z,
  schwa: schwa,
} as const;

import thThis from './th_this.wav';
import thThink from './th_think.wav';
import ch from './ch.wav';
import sh from './sh.wav';

export let BIGRAM_SOUNDS = {
  thThis: thThis,
  thThink: thThink,
  ch: ch,
  sh: sh,
} as const;
