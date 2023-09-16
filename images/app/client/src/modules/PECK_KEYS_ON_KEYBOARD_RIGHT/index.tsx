import {ModuleBuilder, Variant} from '../common/PECK_KEYS/ModuleBuilder';

let variants: Variant[] = [
  'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'u', 'y',
];

export default ModuleBuilder({
  variants: variants,
  timeLimitPerExercise: null,
});
