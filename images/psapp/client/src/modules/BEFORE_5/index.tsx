import {ModuleBuilder} from '@modules/common/CHOICE/ModuleBuilder';
import {Variant, exerciseToSentence, isCorrectChoice} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

const VARIANTS: Variant[] = [
  ['onebefore', 1],
  ['onebefore', 2],
  ['onebefore', 3],
  ['onebefore', 4],
  ['onebefore', 5],
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


