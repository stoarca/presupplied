import {ModuleBuilder, MyEx} from '@src/modules/common/READING/ModuleBuilder';
import {PRONUNCIATIONS} from '@src/util';

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

type Variant = () => typeof sounds[number];

let VARIANTS: Variant[] = [...sounds].map(x => () => x);

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 3,
  getInstructions: ((exercise: MyEx) => {
    let letter = exercise.displayText[exercise.displayText.length - 1];
    let pronunciation = PRONUNCIATIONS[
      letter.toLowerCase() as keyof typeof PRONUNCIATIONS
    ];
    let phrase = exercise.displayText.replace(letter, pronunciation);
    let aOrAn = 'a';
    if ('aeiou'.includes(phrase[0])) {
      aOrAn = 'an';
    }
    return 'What sound does ' + aOrAn + ' ' + phrase + ', make?';
  }),
});

