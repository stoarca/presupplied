import aShortAtSound from './letter_sounds/a_short_at.wav';
import aShortAreSound from './letter_sounds/a_short_are.wav';
import aShortAndSound from './letter_sounds/a_short_and.wav';
import aLongSound from './letter_sounds/a_long.wav';
import bSound from './letter_sounds/b.wav';
// intentionally no c, use k or s instead
import dSound from './letter_sounds/d.wav';
import eShortSound from './letter_sounds/e_short.wav';
import eLongSound from './letter_sounds/e_long.wav';
import fSound from './letter_sounds/f.wav';
import gHardSound from './letter_sounds/g_hard.wav';
import hSound from './letter_sounds/h.wav';
import iShortSound from './letter_sounds/i_short.wav';
import iLongSound from './letter_sounds/i_long.wav';
import jSound from './letter_sounds/j.wav';
import kSound from './letter_sounds/k.wav';
import lSound from './letter_sounds/l.wav';
import mSound from './letter_sounds/m.wav';
import nSound from './letter_sounds/n.wav';
import oShortOutSound from './letter_sounds/o_short_out.wav';
import oShortMomSound from './letter_sounds/o_short_mom.wav';
import oLongGoSound from './letter_sounds/o_long_go.wav';
import oLongMoreSound from './letter_sounds/o_long_more.wav';
import pSound from './letter_sounds/p.wav';
import qSound from './letter_sounds/q.wav';
import rSound from './letter_sounds/r.wav';
import sSound from './letter_sounds/s.wav';
import tSound from './letter_sounds/t.wav';
import uShortDuckSound from './letter_sounds/u_short_duck.wav';
import uShortFullSound from './letter_sounds/u_short_full.wav';
import uShortCuriousSound from './letter_sounds/u_short_curious.wav';
import uLongMuteSound from './letter_sounds/u_long_mute.wav';
import uLongBlueSound from './letter_sounds/u_long_blue.wav';
import vSound from './letter_sounds/v.wav';
import wSound from './letter_sounds/w.wav';
import xSound from './letter_sounds/x.wav';
import yConsonantSound from './letter_sounds/y_consonant.wav';
import zSound from './letter_sounds/z.wav';
import schwaSound from './letter_sounds/schwa.wav';

export let LETTER_SOUNDS = {
  aShortAt: aShortAtSound,
  aShortAre: aShortAreSound,
  aShortAnd: aShortAndSound,
  aLong: aLongSound,
  b: bSound,
  d: dSound,
  eShort: eShortSound,
  eLong: eLongSound,
  f: fSound,
  gHard: gHardSound,
  h: hSound,
  iShort: iShortSound,
  iLong: iLongSound,
  j: jSound,
  k: kSound,
  l: lSound,
  m: mSound,
  n: nSound,
  oShortOut: oShortOutSound,
  oShortMom: oShortMomSound,
  oLongGo: oLongGoSound,
  oLongMore: oLongMoreSound,
  p: pSound,
  q: qSound,
  r: rSound,
  s: sSound,
  t: tSound,
  uShortDuck: uShortDuckSound,
  uShortFull: uShortFullSound,
  uShortCurious: uShortCuriousSound,
  uLongMute: uLongMuteSound,
  uLongBlue: uLongBlueSound,
  v: vSound,
  w: wSound,
  x: xSound,
  yConsonant: yConsonantSound,
  z: zSound,
  schwa: schwaSound,
} as const;

import thThisSound from './letter_sounds/th_this.wav';
import thThinkSound from './letter_sounds/th_think.wav';
import chSound from './letter_sounds/ch.wav';
import shSound from './letter_sounds/sh.wav';

export let BIGRAM_SOUNDS = {
  thThis: thThisSound,
  thThink: thThinkSound,
  ch: chSound,
  sh: shSound,
} as const;

import a from './letters/a.wav';
import b from './letters/b.wav';
import c from './letters/c.wav';
import d from './letters/d.wav';
import e from './letters/e.wav';
import f from './letters/f.wav';
import g from './letters/g.wav';
import h from './letters/h.wav';
import i from './letters/i.wav';
import j from './letters/j.wav';
import k from './letters/k.wav';
import l from './letters/l.wav';
import m from './letters/m.wav';
import n from './letters/n.wav';
import o from './letters/o.wav';
import p from './letters/p.wav';
import q from './letters/q.wav';
import r from './letters/r.wav';
import s from './letters/s.wav';
import t from './letters/t.wav';
import u from './letters/u.wav';
import v from './letters/v.wav';
import w from './letters/w.wav';
import x from './letters/x.wav';
import y from './letters/y.wav';
import z from './letters/z.wav';

export let LETTERS = {
  a: a,
  b: b,
  c: c,
  d: d,
  e: e,
  f: f,
  g: g,
  h: h,
  i: i,
  j: j,
  k: k,
  l: l,
  m: m,
  n: n,
  o: o,
  p: p,
  q: q,
  r: r,
  s: s,
  t: t,
  u: u,
  v: v,
  w: w,
  x: x,
  y: y,
  z: z,
};

import engineerWord from '@src/modules/common/READING/words/engineer';
import astronautWord from '@src/modules/common/READING/words/astronaut';
import firefighterWord from '@src/modules/common/READING/words/firefighter';
import doctorWord from '@src/modules/common/READING/words/doctor';
import painterWord from '@src/modules/common/READING/words/painter';
import plumberWord from '@src/modules/common/READING/words/plumber';
import driverWord from '@src/modules/common/READING/words/driver';
import chefWord from '@src/modules/common/READING/words/chef';
import actorWord from '@src/modules/common/READING/words/actor';
import mechanicWord from '@src/modules/common/READING/words/mechanic';
import accountantWord from '@src/modules/common/READING/words/accountant';
import custodianWord from '@src/modules/common/READING/words/custodian';

export let WORDS = {
  engineer: engineerWord,
  astronaut: astronautWord,
  firefighter: firefighterWord,
  doctor: doctorWord,
  painter: painterWord,
  plumber: plumberWord,
  driver: driverWord,
  chef: chefWord,
  actor: actorWord,
  mechanic: mechanicWord,
  accountant: accountantWord,
  custodian: custodianWord,
};


