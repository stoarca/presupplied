import {ModuleBuilder, Variant} from '../common/PECK_KEYS/ModuleBuilder';

let variants: Variant[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'
];

export default ModuleBuilder({
  variants: variants,
  timeLimitPerExercise: 3000,
});
