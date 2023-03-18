import {
  Variant, Type, ModuleBuilder
} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

let numNumbers = 11;
let f = (type: Type): Variant => {
  return [type, () => {
    let number = Math.floor(Math.random() * (numNumbers - 1));
    if (['allbefore', 'onebefore', 'previous'].includes(type)) {
      number += 1;
    }
    return number;
  }];
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
  numNumbers: numNumbers,
  maxScorePerVariant: 5,
});


