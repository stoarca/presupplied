import {ModuleBuilder, Variant} from '../common/PECK_KEYS/ModuleBuilder';

let variants: Variant[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default ModuleBuilder({
  variants: variants,
  timeLimitPerExercise: 3000,
});
