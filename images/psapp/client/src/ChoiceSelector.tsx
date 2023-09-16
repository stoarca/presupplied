import React from 'react';

type M = React.MouseEvent<SVGRectElement>;

type ChoiceType = number | string;

interface ChoiceSelectorProps<T extends ChoiceType> {
  choices: T[],
  howManyPerRow: number,
  getFill: (element: T) => string,
  onSelected: (index: number) => void,
}

export let ChoiceSelector = <T extends ChoiceType,>(
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
  let startY = (window.innerHeight - (SQLEN + SQPAD) * howManyRows) / 2;
  let textStyle = {
    fontFamily: 'sans-serif',
    fontSize: `${SQLEN - 20}px`,
    pointerEvents: 'none',
  } as React.CSSProperties;
  let choices = [];
  for (let i = 0; i < props.choices.length; ++i) {
    let x = startX + (i % props.howManyPerRow) * (SQLEN + SQPAD) + SQPAD / 2;
    let y = startY + Math.floor(i / props.howManyPerRow) * (SQLEN + SQPAD) + SQPAD / 2;
    let fill = props.getFill(props.choices[i]);
    choices.push(
      <g key={`answer_${i}`} transform={`translate(${x}, ${-SQLEN / 2})`}>
        <rect data-choice-index={i}
            x="0"
            y={y}
            width={SQLEN}
            height={SQLEN}
            rx={10}
            fill={fill}
            stroke="black"
            strokeWidth="5px"
            onClick={handleClick}/>
        <text style={textStyle}
            dominantBaseline="central"
            textAnchor="middle"
            transform={`translate(${SQLEN / 2}, ${SQLEN / 2})`}
            y={y}>
          {props.choices[i]}
        </text>
      </g>
    );
  }

  return (
    <>
      {choices}
    </>
  );
};
