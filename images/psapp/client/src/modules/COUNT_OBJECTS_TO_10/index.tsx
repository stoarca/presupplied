import React from 'react';
import { Module, useExercise, Ex } from '@src/Module';
import { ModuleContext } from '@src/ModuleContext';
import { ProbabilisticDeck } from '@src/util';
import { ChoiceSelector } from '@src/ChoiceSelector';

const appleSvg = '/static/images/objects/svg/apple.svg';
const bananaSvg = '/static/images/objects/svg/banana.svg';
const carSvg = '/static/images/objects/svg/car.svg';
const catSvg = '/static/images/objects/svg/cat.svg';
const dogSvg = '/static/images/objects/svg/dog.svg';
const duckSvg = '/static/images/objects/svg/duck.svg';
const flowerSvg = '/static/images/objects/svg/flower.svg';
const starSvg = '/static/images/objects/svg/star.svg';
const treeSvg = '/static/images/objects/svg/tree.svg';
const truckSvg = '/static/images/objects/svg/truck.svg';

const OBJECTS = [
  { name: 'apple', svg: appleSvg },
  { name: 'banana', svg: bananaSvg },
  { name: 'car', svg: carSvg },
  { name: 'cat', svg: catSvg },
  { name: 'dog', svg: dogSvg },
  { name: 'duck', svg: duckSvg },
  { name: 'flower', svg: flowerSvg },
  { name: 'star', svg: starSvg },
  { name: 'tree', svg: treeSvg },
  { name: 'truck', svg: truckSvg },
];

type Variant = number; // Just the count

interface MyEx extends Ex<Variant> {
  object: typeof OBJECTS[0];
}

const VARIANTS: Variant[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default (props: void) => {
  let moduleContext = React.useContext(ModuleContext);

  const [lastSelected, setLastSelected] = React.useState<number | null>(null);

  let vlist = React.useMemo(() => new ProbabilisticDeck(
    VARIANTS.map(v => ({ variant: v, millicards: 3000 })),
    3000
  ), []);

  let generateExercise = React.useCallback((): MyEx => {
    setLastSelected(null);
    const count = vlist.pickVariant();
    const object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    return {
      variant: count,
      object: object,
    };
  }, [vlist]);

  let playInstructions = React.useCallback((exercise: MyEx) => {
    moduleContext.playTTS(`How many ${exercise.object.name}s are there?`);
  }, [moduleContext]);

  let {
    exercise,
    score,
    maxScore,
    doSuccess,
    doPartialSuccess,
    doFailure,
  } = useExercise({
    onGenExercise: generateExercise,
    initialPartial: (): number | null => null,
    onPlayInstructions: playInstructions,
    playOnEveryExercise: true,
    vlist: vlist,
  });

  const objectPositions = React.useMemo(() => {
    const positions: { x: number; y: number; rotation: number }[] = [];
    const count = exercise.variant;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 150; // Move objects up more to make room for choices
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) / 4;

    for (let i = 0; i < count; i++) {
      let x: number; let y: number;
      let attempts = 0;
      const minDistance = 80;

      do {
        const angle = (Math.random() * 2 * Math.PI);
        const radius = Math.random() * maxRadius;
        x = centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 40;
        y = centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 40;

        attempts++;
        if (attempts > 100) {break;}
      } while (
        positions.some(pos =>
          Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minDistance
        )
      );

      positions.push({
        x,
        y,
        rotation: Math.random() * 30 - 15
      });
    }

    return positions;
  }, [exercise]);

  const choices = React.useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  }, []);

  const handleSelected = React.useCallback(async (index: number) => {
    const selectedNumber = choices[index];
    setLastSelected(selectedNumber);
    if (selectedNumber === exercise.variant) {
      await doPartialSuccess(selectedNumber);
      doSuccess();
    } else {
      await doFailure();
    }
  }, [choices, exercise, doSuccess, doPartialSuccess, doFailure]);

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        handleSelected(num - 1);
      } else if (e.key === '0') {
        handleSelected(9);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleSelected]);

  const getFill = React.useCallback((choice: number) => {
    if (lastSelected === choice) {
      if (choice === exercise.variant) {
        return '#00ff0033';
      } else {
        return '#ff000033';
      }
    }
    return 'white';
  }, [lastSelected, exercise]);

  return (
    <Module type="svg" score={score} maxScore={maxScore}>
      {objectPositions.map((pos, i) => (
        <image
          key={i}
          href={exercise.object.svg}
          x={pos.x - 40}
          y={pos.y - 40}
          width="80"
          height="80"
          transform={`rotate(${pos.rotation} ${pos.x} ${pos.y})`}
        />
      ))}

      <ChoiceSelector
        choices={choices}
        howManyPerRow={10}
        getFill={getFill}
        onSelected={handleSelected}
        position="bottom"
      />
    </Module>
  );
};
