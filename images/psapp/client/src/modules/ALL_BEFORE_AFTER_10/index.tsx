import {ModuleBuilder} from '@modules/common/CHOICE/ModuleBuilder';
import {
  Variant,
  Type,
  exerciseToSentence,
  isCorrectChoice,
  getAllCorrectChoices
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let numNumbers = 11;
let f = (type: Type): Variant => {
  let number = Math.floor(Math.random() * (numNumbers - 1));
  if (['allbefore', 'onebefore', 'previous'].includes(type)) {
    number += 1;
  }
  return [type, number];
};

let types: Type[] = [
  'allbefore',
  'onebefore',
  'previous',
  'allafter',
  'oneafter',
  'next',
];
let VARIANTS: Variant[] = types.map(f);

export default ModuleBuilder({
  variants: VARIANTS,
  generateChoices: () => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  },
  getInstruction: (exercise) => {
    return exerciseToSentence(exercise);
  },
  getHighlightedChoice: (exercise) => {
    return exercise.variant[1];
  },
  isCorrectChoice: (choice, exercise) => {
    return isCorrectChoice(choice, exercise);
  },
  allowMultipleSelections: true,
  getAllCorrectChoices: (exercise) => {
    return getAllCorrectChoices(exercise, numNumbers);
  },
  howManyPerRow: 10,
  maxScorePerVariant: 5000,
});


