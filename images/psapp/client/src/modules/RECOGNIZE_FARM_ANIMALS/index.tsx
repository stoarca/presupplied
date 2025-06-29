import React from 'react';
import {ModuleBuilder, ChoiceItem, MyEx} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {pickFromBag, shuffle, ProbabilisticDeck} from '@src/util';

interface ObjectInfo {
  name: string;
  imageUrl: string;
  pronunciation?: string;
}

const FARM_ANIMALS: readonly ObjectInfo[] = [
  { name: 'cow', imageUrl: '/static/images/objects/svg/cow.svg' },
  { name: 'sheep', imageUrl: '/static/images/objects/svg/sheep.svg' },
  { name: 'horse', imageUrl: '/static/images/objects/svg/horse.svg' },
  { name: 'donkey', imageUrl: '/static/images/objects/svg/donkey.svg' },
  { name: 'duck', imageUrl: '/static/images/objects/svg/duck.svg' },
  { name: 'cat', imageUrl: '/static/images/objects/svg/cat.svg' },
  { name: 'dog', imageUrl: '/static/images/objects/svg/dog.svg' },
  { name: 'mouse', imageUrl: '/static/images/objects/svg/mouse.svg' },
];

const ALL_OBJECTS: readonly ObjectInfo[] = [
  { name: 'ant', imageUrl: '/static/images/objects/svg/ant.svg' },
  { name: 'apple', imageUrl: '/static/images/objects/svg/apple.svg' },
  { name: 'baby', imageUrl: '/static/images/objects/svg/baby.svg' },
  { name: 'banana', imageUrl: '/static/images/objects/svg/banana.svg' },
  { name: 'bed', imageUrl: '/static/images/objects/svg/bed.svg' },
  { name: 'bee', imageUrl: '/static/images/objects/svg/bee.svg' },
  { name: 'boy', imageUrl: '/static/images/objects/svg/boy.svg' },
  { name: 'car', imageUrl: '/static/images/objects/svg/car.svg' },
  { name: 'cat', imageUrl: '/static/images/objects/svg/cat.svg' },
  { name: 'chair', imageUrl: '/static/images/objects/svg/chair.svg' },
  { name: 'cow', imageUrl: '/static/images/objects/svg/cow.svg' },
  { name: 'cup', imageUrl: '/static/images/objects/svg/cup.svg' },
  { name: 'dog', imageUrl: '/static/images/objects/svg/dog.svg' },
  { name: 'doll', imageUrl: '/static/images/objects/svg/doll.svg' },
  { name: 'donkey', imageUrl: '/static/images/objects/svg/donkey.svg' },
  { name: 'duck', imageUrl: '/static/images/objects/svg/duck.svg' },
  { name: 'flower', imageUrl: '/static/images/objects/svg/flower.svg' },
  { name: 'foot', imageUrl: '/static/images/objects/svg/foot.svg' },
  { name: 'fridge', imageUrl: '/static/images/objects/svg/fridge.svg' },
  { name: 'girl', imageUrl: '/static/images/objects/svg/girl.svg' },
  { name: 'hand', imageUrl: '/static/images/objects/svg/hand.svg' },
  { name: 'hat', imageUrl: '/static/images/objects/svg/hat.svg' },
  { name: 'horse', imageUrl: '/static/images/objects/svg/horse.svg' },
  { name: 'house', imageUrl: '/static/images/objects/svg/house.svg' },
  { name: 'lamp', imageUrl: '/static/images/objects/svg/lamp.svg' },
  { name: 'man', imageUrl: '/static/images/objects/svg/man.svg' },
  { name: 'microwave', imageUrl: '/static/images/objects/svg/microwave.svg' },
  { name: 'mittens', imageUrl: '/static/images/objects/svg/mittens.svg' },
  { name: 'mouse', imageUrl: '/static/images/objects/svg/mouse.svg' },
  { name: 'owl', imageUrl: '/static/images/objects/svg/owl.svg' },
  { name: 'pants', imageUrl: '/static/images/objects/svg/pants.svg' },
  { name: 'potty', imageUrl: '/static/images/objects/svg/potty.svg' },
  { name: 'sheep', imageUrl: '/static/images/objects/svg/sheep.svg' },
  { name: 'shirt', imageUrl: '/static/images/objects/svg/shirt.svg' },
  { name: 'shoes', imageUrl: '/static/images/objects/svg/shoes.svg' },
  { name: 'shorts', imageUrl: '/static/images/objects/svg/shorts.svg' },
  { name: 'socks', imageUrl: '/static/images/objects/svg/socks.svg' },
  { name: 'sofa', imageUrl: '/static/images/objects/svg/sofa.svg' },
  { name: 'star', imageUrl: '/static/images/objects/svg/star.svg' },
  { name: 'strawberry', imageUrl: '/static/images/objects/svg/strawberry.svg' },
  { name: 'table', imageUrl: '/static/images/objects/svg/table.svg' },
  { name: 'tent', imageUrl: '/static/images/objects/svg/tent.svg' },
  { name: 'tree', imageUrl: '/static/images/objects/svg/tree.svg' },
  { name: 'truck', imageUrl: '/static/images/objects/svg/truck.svg' },
  { name: 'tv', imageUrl: '/static/images/objects/svg/tv.svg', pronunciation: 'T V' },
  { name: 'watermelon', imageUrl: '/static/images/objects/svg/watermelon.svg' },
  { name: 'woman', imageUrl: '/static/images/objects/svg/woman.svg' },
];

export default () => {
  const moduleContext = React.useContext(ModuleContext);

  const vlist = React.useMemo(() => new ProbabilisticDeck(
    FARM_ANIMALS.map(v => ({ variant: v, millicards: 2000 })),
    2000
  ), []);

  const generateChoices = React.useCallback((variant: ObjectInfo) => {
    const others = pickFromBag(ALL_OBJECTS.filter(x => x.imageUrl !== variant.imageUrl), 4, {
      withReplacement: false,
    });
    const allChoices = [...others, variant];
    shuffle(allChoices);
    return allChoices.map(obj => ({ imageUrl: obj.imageUrl }));
  }, []);

  const playInstructions = React.useCallback((exercise: MyEx<ObjectInfo>, cancelRef: { cancelled: boolean }) => {
    const variant = exercise.variant;
    const pronunciation = variant.pronunciation || variant.name;
    moduleContext.playTTS(`Which one is the ${pronunciation}?`, { cancelRef });
  }, [moduleContext]);

  const isCorrectChoice = React.useCallback((choice: ChoiceItem, exercise: MyEx<ObjectInfo>) => {
    const variant = exercise.variant;
    return typeof choice === 'object' && 'imageUrl' in choice && choice.imageUrl === variant.imageUrl;
  }, []);

  const getFill = React.useCallback((choice: ChoiceItem, exercise: MyEx<ObjectInfo>, partial: ChoiceItem[], alreadyFailed: boolean) => {
    if (alreadyFailed && typeof choice === 'object' && 'imageUrl' in choice && choice.imageUrl === exercise.variant.imageUrl) {
      return 'wrong';
    }
    return 'white';
  }, []);

  const initialPartial = React.useCallback(() => [] as ChoiceItem[], []);

  return <ModuleBuilder
    vlist={vlist}
    generateChoices={generateChoices}
    playInstructions={playInstructions}
    isCorrectChoice={isCorrectChoice}
    getFill={getFill}
    initialPartial={initialPartial}
    howManyPerRow={5}
  />;
};