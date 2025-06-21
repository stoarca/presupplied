import {ModuleBuilder} from '@modules/common/CHOICE/ModuleBuilder';
import {pickFromBag, shuffle, SIMPLE_OBJECTS} from '@src/util';

const OBJECTS = SIMPLE_OBJECTS.map(obj => ({
  name: obj.name,
  imageUrl: obj.image,
}));

export default ModuleBuilder({
  variants: OBJECTS,
  generateChoices: (variant, allVariants) => {
    const others = pickFromBag(allVariants.filter(x => x !== variant), 4, {
      withReplacement: false,
    });
    const allChoices = [...others, variant];
    shuffle(allChoices);
    return allChoices.map(obj => ({ imageUrl: obj.imageUrl }));
  },
  getInstruction: () => {
    return 'Pick the identical object.';
  },
  getDisplay: (exercise) => {
    return { imageUrl: exercise.variant.imageUrl };
  },
  isCorrectChoice: (choice, exercise) => {
    const variant = exercise.variant;
    return typeof choice === 'object' && 'imageUrl' in choice && choice.imageUrl === variant.imageUrl;
  },
  howManyPerRow: 5,
  position: 'bottom',
  playOnEveryExercise: false,
  waitForInstructions: false,
});