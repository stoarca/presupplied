import React from 'react';

type M = React.MouseEvent<SVGRectElement>;

type ChoiceType = number | string | { imageUrl: string };

const isImageChoice = (choice: ChoiceType): choice is { imageUrl: string } => {
  return typeof choice === 'object' && choice !== null && 'imageUrl' in choice;
};

interface ChoiceSelectorProps<T extends ChoiceType> {
  choices: T[],
  howManyPerRow: number,
  getFill: (element: T) => string,
  onSelected: (index: number) => void,
  position?: 'center' | 'bottom',
}

export let ChoiceSelector = <T extends ChoiceType, >(
  props: React.PropsWithChildren<ChoiceSelectorProps<T>>
) => {
  let handleClick = React.useCallback((e: M) => {
    if (e.button !== 0) {
      return;
    }
    let index = parseInt(e.currentTarget.getAttribute('data-choice-index')!);
    return props.onSelected(index);
  }, [props.onSelected]);
  let SQLEN = 100;
  let SQPAD = 10;
  let howManyRows = Math.ceil(props.choices.length / props.howManyPerRow);
  let startX = (window.innerWidth - (SQLEN + SQPAD) * props.howManyPerRow) / 2;
  let startY;

  if (props.position === 'bottom') {
    startY = window.innerHeight - (SQLEN + SQPAD) * howManyRows - 50;
  } else {
    startY = (window.innerHeight - (SQLEN + SQPAD) * howManyRows) / 2;
  }
  let textStyle = {
    fontFamily: 'sans-serif',
    fontSize: `${SQLEN - 20}px`,
    pointerEvents: 'none',
  } as React.CSSProperties;
  let choices = [];
  for (let i = 0; i < props.choices.length; ++i) {
    const choice = props.choices[i];
    let x = startX + (i % props.howManyPerRow) * (SQLEN + SQPAD) + SQPAD / 2;
    let y = startY + Math.floor(i / props.howManyPerRow) * (SQLEN + SQPAD) + SQPAD / 2;
    let fill = props.getFill(choice);
    choices.push(
      <g key={`answer_${i}`} transform={`translate(${x}, ${-SQLEN / 2})`}>
        <rect data-choice-index={i}
          x="0"
          y={y}
          width={SQLEN}
          height={SQLEN}
          rx={10}
          fill={fill}
          stroke={isImageChoice(choice) ? 'none' : 'black'}
          strokeWidth={isImageChoice(choice) ? '0' : '5px'}
          onClick={handleClick}/>
        {isImageChoice(choice) ? (
          <image
            href={choice.imageUrl}
            x={10}
            y={y + 10}
            width={SQLEN - 20}
            height={SQLEN - 20}
            pointerEvents="none"
          />
        ) : (
          <text style={textStyle}
            dominantBaseline="central"
            textAnchor="middle"
            transform={`translate(${SQLEN / 2}, ${SQLEN / 2})`}
            y={y}>
            {choice}
          </text>
        )}
      </g>
    );
  }

  return (
    <>
      {choices}
    </>
  );
};
