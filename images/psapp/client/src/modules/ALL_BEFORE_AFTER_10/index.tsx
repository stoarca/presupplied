import {ModuleBuilder, Variant, Type} from '@src/modules/common/BEFORE_AFTER_NUMBERS/ModuleBuilder';

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
  variants: VARIANTS.map(v => ({ variant: v, millicards: 5000 })),
  maxMillicardsPerVariant: 5000,
  generateChoices: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  howManyPerRow: 10,
});


