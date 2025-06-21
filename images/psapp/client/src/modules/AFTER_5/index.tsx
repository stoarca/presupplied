import {ModuleBuilder} from '@modules/common/CHOICE/ModuleBuilder';
import {Variant, exerciseToSentence, isCorrectChoice} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

const VARIANTS: Variant[] = [
  ['oneafter', 0],
  ['oneafter', 1],
  ['oneafter', 2],
  ['oneafter', 3],
  ['oneafter', 4],
];

export default ModuleBuilder({
  variants: VARIANTS,
  generateChoices: () => {
    return [0, 1, 2, 3, 4, 5];
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
  howManyPerRow: 6,
  maxScorePerVariant: 5000,
  waitForInstructions: false,
});


