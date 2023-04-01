import React from 'react';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {VariantList, PRONUNCIATIONS} from '@src/util';
import {STTModule} from '@src/modules/common/SPEECH_TO_TEXT_SHIM/ModuleBuilder';

let sounds = [
  'long A',
  'short A',
  'B',
  'hard C',
  'soft C',
  'D',
  'E',
  'F',
  'hard G',
  'soft G',
  'H',
  'long I',
  'short I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'long O',
  'short O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'long U',
  'short U',
  'V',
  'W',
  'X',
  'consonant Y',
  '(short word) vowel Y',
  '(long word) vowel Y',
  'Z',
] as const;

type Variant = typeof sounds[number];

interface MyEx extends Ex<Variant> {
}

let VARIANTS: Variant[] = [...sounds];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  let vlist = React.useMemo(() => new VariantList(VARIANTS, 3), []);
  let generateExercise = React.useCallback(() => {
    return {
      variant: vlist.pickVariant(),
    };
  }, [vlist]);
  let playInstructions = React.useCallback(async (exercise: MyEx) => {
    let letter = exercise.variant[exercise.variant.length - 1];
    let pronunciation = PRONUNCIATIONS[
      letter.toLowerCase() as keyof typeof PRONUNCIATIONS
    ];
    let phrase = exercise.variant.replace(letter, pronunciation);
    let aOrAn = 'a';
    if ('aeiou'.includes(phrase[0])) {
      aOrAn = 'an';
    }
    await moduleContext.playTTS(
      'What sound does ' + aOrAn + ' ' + phrase + ', make?'
    );
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

  let style: React.CSSProperties = {
    fontFamily: 'sans-serif',
    fontSize: '100px',
  };
  return (
    <STTModule doSuccess={doSuccess}
        doFailure={doFailure}
        score={score}
        maxScore={maxScore}>
      <text style={style}
          dominantBaseline="central"
          textAnchor="middle"
          y="200"
          x="50%">
        {exercise.variant}
      </text>
    </STTModule>
  );
};

