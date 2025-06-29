import React from 'react';
import {ModuleBuilder, ChoiceItem, MyEx} from '@modules/common/CHOICE/ModuleBuilder';
import {ModuleContext} from '@src/ModuleContext';
import {pickFromBag, shuffle, SIMPLE_OBJECTS, ProbabilisticDeck} from '@src/util';

interface ObjectInfo {
  name: string;
  imageUrl: string;
}

const OBJECTS: ObjectInfo[] = SIMPLE_OBJECTS.map(obj => ({
  name: obj.name,
  imageUrl: obj.image,
}));

export default () => {
  const moduleContext = React.useContext(ModuleContext);

  const vlist = React.useMemo(() => new ProbabilisticDeck(
    OBJECTS.map(v => ({ variant: v, millicards: 2000 })),
    2000
  ), []);

  const generateChoices = React.useCallback((variant: ObjectInfo) => {
    const others = pickFromBag(OBJECTS.filter(x => x !== variant), 4, {
      withReplacement: false,
    });
    const allChoices = [...others, variant];
    shuffle(allChoices);
    return allChoices.map(obj => ({ imageUrl: obj.imageUrl }));
  }, []);

  const playInstructions = React.useCallback((exercise: MyEx<ObjectInfo>, cancelRef: { cancelled: boolean }) => {
    moduleContext.playTTS('Pick the identical object.', { cancelRef });
  }, [moduleContext]);

  const getDisplay = React.useCallback((exercise: MyEx<ObjectInfo>) => {
    return { imageUrl: exercise.variant.imageUrl };
  }, []);

  const isCorrectChoice = React.useCallback((choice: ChoiceItem, exercise: MyEx<ObjectInfo>) => {
    const variant = exercise.variant;
    return typeof choice === 'object' && 'imageUrl' in choice && choice.imageUrl === variant.imageUrl;
  }, []);

  const getFill = React.useCallback((choice: ChoiceItem, exercise: MyEx<ObjectInfo>, partial: ChoiceItem[], alreadyFailed: boolean) => {
    const partialChoices = partial as ChoiceItem[];

    const isSelected = partialChoices.some(p =>
      typeof p === 'object' && typeof choice === 'object' &&
      'imageUrl' in p && 'imageUrl' in choice &&
      p.imageUrl === choice.imageUrl
    );

    if (isSelected) {
      return 'correct';
    }

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
    getDisplay={getDisplay}
    isCorrectChoice={isCorrectChoice}
    getFill={getFill}
    initialPartial={initialPartial}
    howManyPerRow={5}
    position="bottom"
    playOnEveryExercise={false}
  />;
};