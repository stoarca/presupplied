import React from 'react';

import {range} from '@src/util';

let _VisualFractionTypes = [
  'rect', 'circle', 'triangle', 'parallelogram', 'trapezoid', 'regular',
] as const;
export type VisualFractionTypeTuple = typeof _VisualFractionTypes;
export type VisualFractionType = VisualFractionTypeTuple[number];
export let VisualFractionTypes =
    _VisualFractionTypes as unknown as VisualFractionType[];

interface VisualFractionProps {
  type: VisualFractionType;
  size: number;
  color: string;
  numerator: number;
  denominator: number;
}

export let VisualFraction: React.FC<VisualFractionProps> = (props) => {
  let emptyStyle = {
    fill: 'transparent',
    stroke: '#aaaaaa',
    strokeWidth: '3',
    strokeDasharray: '10 10',
  };
  let filledStyle = {
    fill: props.color,
  };

  let SIZE = props.size;

  let whole;
  let lines = [];
  let slice;
  if (props.type === 'rect') {
    whole = (
      <rect x={0} y={0} width={SIZE} height={SIZE} style={emptyStyle}/>
    );
    for (let i = 1; i < props.denominator; ++i) {
      lines.push(
        <line key={i}
          x1={i * SIZE / props.denominator}
          y1={0}
          x2={i * SIZE / props.denominator}
          y2={SIZE}
          style={emptyStyle}/>
      );
    }
    slice = (
      <rect x={0}
        y={0}
        width={props.numerator * SIZE / props.denominator}
        height={SIZE}
        style={filledStyle}/>
    );
  } else if (props.type === 'circle') {
    let X = SIZE / 2;
    let Y = SIZE / 2;
    let R = SIZE / 2;
    whole = (
      <circle cx={X} cy={Y} r={R} style={emptyStyle}/>
    );
    for (let i = 0; i < props.denominator; ++i) {
      let a = i * Math.PI * 2 / props.denominator;
      lines.push(
        <line key={i}
          x1={X}
          y1={Y}
          x2={X + R * Math.cos(a)}
          y2={Y - R * Math.sin(a)}
          style={emptyStyle}/>
      );
    }
    if (props.numerator === props.denominator) {
      slice = (
        <circle cx={X} cy={Y} r={R} style={filledStyle}/>
      );
    } else {
      let a = props.numerator * Math.PI * 2 / props.denominator;
      slice = (
        <path style={filledStyle} d={`
            M ${X} ${Y}
            L ${X + R} ${Y}
            A ${R} ${R} 0 0 0 ${X + R * Math.cos(a)} ${Y - R * Math.sin(a)}
            Z
          `}/>
      );
    }
  } else if (props.type === 'triangle') {
    whole = (
      <path style={emptyStyle} d={`
            M ${SIZE / 2} 0
            L 0 ${SIZE}
            L ${SIZE} ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < props.denominator; ++i) {
      lines.push(
        <line key={i}
          x1={SIZE / 2}
          y1={0}
          x2={i * SIZE / props.denominator}
          y2={SIZE}
          style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M ${SIZE / 2} 0
            L 0 ${SIZE}
            L ${props.numerator * SIZE / props.denominator} ${SIZE}
            Z
          `}/>
    );
  } else if (props.type === 'parallelogram') {
    let D = SIZE / 4;
    whole = (
      <path style={emptyStyle} d={`
            M ${D} 0
            L ${SIZE} 0
            L ${SIZE - D} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < props.denominator; ++i) {
      lines.push(
        <line key={i}
          x1={D + i * (SIZE - D) / props.denominator}
          y1={0}
          x2={i * (SIZE - D) / props.denominator}
          y2={SIZE}
          style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M ${D} 0
            L ${D + props.numerator * (SIZE - D) / props.denominator} 0
            L ${props.numerator * (SIZE - D) / props.denominator} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
  } else if (props.type === 'trapezoid') {
    let D = SIZE / 4;
    whole = (
      <path style={emptyStyle} d={`
            M ${D} 0
            L ${SIZE - D} 0
            L ${SIZE} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < props.denominator; ++i) {
      lines.push(
        <line key={i}
          x1={D + i * (SIZE - 2 * D) / props.denominator}
          y1={0}
          x2={i * SIZE / props.denominator}
          y2={SIZE}
          style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M ${D} 0
            L ${D + props.numerator * (SIZE - 2 * D) / props.denominator} 0
            L ${props.numerator * SIZE / props.denominator} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
  } else if (props.type === 'regular') {
    if (props.denominator < 3) {
      throw new Error('VisualFraction regular must have denom >= 3');
    }
    let X = SIZE / 2;
    let Y = SIZE / 2;
    let R = SIZE / 2;
    whole = (
      <path style={emptyStyle} d={`
            M ${SIZE} ${SIZE / 2}
            ${range(props.denominator - 1).map(x => {
        let a = (x + 1) * Math.PI * 2 / props.denominator;
        return 'L ' + (X + R * Math.cos(a)) + ' ' + (Y + R * Math.sin(a));
      }).join(' ')}
            Z
          `}/>
    );
    for (let i = 0; i < props.denominator; ++i) {
      let a = i * Math.PI * 2 / props.denominator;
      lines.push(
        <line key={i}
          x1={X}
          y1={Y}
          x2={X + R * Math.cos(a)}
          y2={Y + R * Math.sin(a)}
          style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M ${SIZE} ${SIZE / 2}
            ${range(props.numerator).map(x => {
        let a = (x + 1) * Math.PI * 2 / props.denominator;
        return 'L ' + (X + R * Math.cos(a)) + ' ' + (Y + R * Math.sin(a));
      }).join(' ')}
            L ${X} ${Y}
            Z
          `}/>
    );
  } else {
    let exhaustiveCheck: never = props.type;
    throw new Error(`VisualFraction unknown type ${exhaustiveCheck}`);
  }
  return (
    <g>
      {slice}
      {whole}
      {props.denominator >= 2 ? lines : null}
    </g>
  );
};
