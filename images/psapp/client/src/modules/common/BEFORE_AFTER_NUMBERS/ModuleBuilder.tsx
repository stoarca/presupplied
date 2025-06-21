import {MyEx as ChoiceEx, ChoiceItem} from '@modules/common/CHOICE/ModuleBuilder';

export type Type =
    'allbefore' | 'onebefore' | 'previous' | 'allafter' | 'oneafter' | 'next';

export type Variant = [Type, number];

export interface MyEx extends ChoiceEx<Variant> {
}

export let exerciseToSentence = (exercise: MyEx) => {
  const number = exercise.variant[1];
  if (exercise.variant[0] === 'allbefore') {
    return `Tap all the numbers that come before ${number}.`;
  } else if (exercise.variant[0] === 'onebefore') {
    return `Tap the number that comes before ${number}.`;
  } else if (exercise.variant[0] === 'previous') {
    return `We're at ${number}. Tap the previous number.`;
  } else if (exercise.variant[0] === 'allafter') {
    return `Tap all the numbers that come after ${number}.`;
  } else if (exercise.variant[0] === 'oneafter') {
    return `Tap the number that comes after ${number}.`;
  } else if (exercise.variant[0] === 'next') {
    return `We're at ${number}. Tap the next number.`;
  } else {
    let exhaustiveCheck: never = exercise.variant[0]; // eslint-disable-line no-unused-vars
    throw new Error('exerciseToSentence unknown variant ' + exercise.variant);
  }
};

export let isCorrectChoice = (choice: ChoiceItem, exercise: MyEx): boolean => {
  const type = exercise.variant[0];
  const number = exercise.variant[1];

  if (typeof choice !== 'number') {
    return false;
  }

  if (['allbefore', 'onebefore', 'previous'].includes(type)) {
    if (type === 'allbefore') {
      return choice < number;
    } else {
      return choice === number - 1;
    }
  } else if (type === 'allafter') {
    return choice > number;
  } else {
    return choice === number + 1;
  }
};

export let getAllCorrectChoices = (exercise: MyEx, numNumbers: number): ChoiceItem[] => {
  const type = exercise.variant[0];
  const number = exercise.variant[1];

  if (type === 'allbefore') {
    return Array.from({length: number}, (_, i) => i);
  } else if (type === 'allafter') {
    return Array.from({length: numNumbers - number - 1}, (_, i) => number + 1 + i);
  } else {
    return [type === 'onebefore' || type === 'previous'
      ? number - 1
      : number + 1];
  }
};

