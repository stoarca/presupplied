import React from 'react';

import {range, getPointOnUnitSquare} from '@src/util';

let _BadVisualFractionTypes = [
  'rect', 'circle', 'triangle', 'parallelogram', 'trapezoid',
] as const;
export type BadVisualFractionTypeTuple = typeof _BadVisualFractionTypes;
export type BadVisualFractionType = BadVisualFractionTypeTuple[number];
export let BadVisualFractionTypes =
    _BadVisualFractionTypes as unknown as BadVisualFractionType[];

interface BadVisualFractionProps {
  type: BadVisualFractionType;
  size: number;
  color: string;
  numerator: number;
  denominator: number;
}

export let BadVisualFraction: React.FC<BadVisualFractionProps> = (props) => {
  let emptyStyle = {
    fill: 'transparent',
    stroke: '#aaaaaa',
    strokeWidth: '3',
    strokeDasharray: '10 10',
  };
  let filledStyle = {
    fill: props.color,
  };

  let {numerator, denominator} = props;
  let frac = numerator / denominator;

  if (frac === 1 || frac === 0.5) {
    // Hard to make wholes or halves be bad
    denominator += 2;
    frac = numerator / denominator;
  }

  console.log(props.type);
  console.log(props.numerator);
  console.log(props.denominator);

  let SIZE = props.size;
  let whole;
  let lines = [];
  let slice;
  if (props.type === 'rect') {
    whole = (
      <rect x={0} y={0} width={SIZE} height={SIZE} style={emptyStyle}/>
    );
    if (denominator % 2 == 0) {
      for (let i = 1; i < denominator; ++i) {
        lines.push(
          <line key={i}
              x1={Math.min(i * SIZE * 2 / denominator, SIZE)}
              y1={Math.max(-SIZE + i * SIZE * 2 / denominator, 0)}
              x2={Math.max(-SIZE + i * SIZE * 2 / denominator, 0)}
              y2={Math.min(i * SIZE * 2 / denominator, SIZE)}
              style={emptyStyle}/>
        );
        if (numerator * 2 < denominator) {
          slice = (
            <path style={filledStyle} d={`
                  M 0 0
                  L ${frac * SIZE * 2} 0
                  L 0 ${frac * SIZE * 2}
                  Z
                `}/>
          );
        } else {
          slice = (
            <path style={filledStyle} d={`
                  M 0 0
                  L ${SIZE} 0
                  L ${SIZE} ${-SIZE + frac * SIZE * 2}
                  L ${-SIZE + frac * SIZE * 2} ${SIZE}
                  L 0 ${SIZE}
                  Z
                `}/>
          );
        }
      }
    } else {
      for (let i = 0; i < denominator; ++i) {
        let a = i * Math.PI * 2 / denominator;
        let {x, y} = getPointOnUnitSquare(a);
        lines.push(
          <line key={i}
              x1={SIZE / 2}
              y1={SIZE / 2}
              x2={SIZE / 2 + x * SIZE / 2}
              y2={SIZE / 2 - y * SIZE / 2}
              style={emptyStyle}/>
        );
      }
      let a = frac * Math.PI * 2;
      let {x, y} = getPointOnUnitSquare(a);
      console.log(x, y);
      slice = (
        <path style={filledStyle} d={`
              M ${SIZE / 2} ${SIZE / 2}
              L ${SIZE} ${SIZE / 2}
              ${frac > 1/8 ? `L ${SIZE} 0` : ''}
              ${frac > 3/8 ? `L 0 0` : ''}
              ${frac > 5/8 ? `L 0 ${SIZE}` : ''}
              ${frac > 7/8 ? `L ${SIZE} ${SIZE}` : ''}
              L ${SIZE / 2 + x * SIZE / 2} ${SIZE / 2 - y * SIZE / 2}
              Z
            `}/>
      );
    }
  } else if (props.type === 'circle') {
    let X = SIZE / 2;
    let Y = SIZE / 2;
    let R = SIZE / 2;
    whole = (
      <circle cx={X} cy={Y} r={R} style={emptyStyle}/>
    );
    for (let i = 1; i < denominator; ++i) {
      let xunit = i * 2 / denominator - 1;
      let yunit = Math.sqrt(1 - xunit * xunit);
      lines.push(
        <line key={i}
            x1={SIZE / 2 + xunit * SIZE / 2}
            y1={SIZE / 2 - yunit * SIZE / 2}
            x2={SIZE / 2 + xunit * SIZE / 2}
            y2={SIZE / 2 + yunit * SIZE / 2}
            style={emptyStyle}/>
      );
    }
    let xunit = frac * 2 - 1;
    let yunit = Math.sqrt(1 - xunit * xunit);
    let x = xunit * SIZE / 2;
    let y = yunit * SIZE / 2;
    let flag = frac > 0.5 ? 1 : 0
    slice = (
      <path style={filledStyle} d={`
            M ${SIZE / 2 + x} ${SIZE / 2 - y}
            A ${SIZE / 2} ${SIZE / 2} 0 ${flag} 0 ${SIZE / 2 + x} ${SIZE / 2 + y}
            Z
          `}/>
    );
  } else if (props.type === 'triangle') {
    whole = (
      <path style={emptyStyle} d={`
            M ${SIZE / 2} 0
            L 0 ${SIZE}
            L ${SIZE} ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < denominator; ++i) {
      let xunit = i / denominator;
      let y = Math.abs(0.5 - xunit) * SIZE * 2;
      lines.push(
        <line key={i}
            x1={i * SIZE / denominator}
            y1={y}
            x2={i * SIZE / denominator}
            y2={SIZE}
            style={emptyStyle}/>
      );
    }
    let xunit = frac;
    let y = Math.abs(0.5 - xunit) * SIZE * 2;
    slice = (
      <path style={filledStyle} d={`
            M ${frac * SIZE} ${SIZE}
            L 0 ${SIZE}
            ${frac > 0.5 ? `L ${SIZE / 2} 0` : ''}
            L ${frac * SIZE} ${y}
            Z
          `}/>
    );
  } else if (props.type === 'parallelogram') {
    let D = SIZE / 4;
    let W = SIZE - 2 * D;
    whole = (
      <path style={emptyStyle} d={`
            M ${D} 0
            L ${SIZE} 0
            L ${SIZE - D} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < denominator; ++i) {
      lines.push(
        <line key={i}
            x1={D + (i - 1) * W / (denominator - 2)}
            y1={0}
            x2={D + (i - 1) * W / (denominator - 2)}
            y2={SIZE}
            style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M 0 ${SIZE}
            L ${D} 0
            L ${D + (numerator - 1) * W / (denominator - 2)} 0
            L ${D + (numerator - 1) * W / (denominator - 2)} ${SIZE}
            Z
          `}/>
    );
  } else if (props.type === 'trapezoid') {
    let D = SIZE / 4;
    let W = SIZE - 2 * D;
    whole = (
      <path style={emptyStyle} d={`
            M ${D} 0
            L ${SIZE - D} 0
            L ${SIZE} ${SIZE}
            L 0 ${SIZE}
            Z
          `}/>
    );
    for (let i = 1; i < denominator; ++i) {
      lines.push(
        <line key={i}
            x1={D + (i - 1) * W / (denominator - 2)}
            y1={0}
            x2={D + (i - 1) * W / (denominator - 2)}
            y2={SIZE}
            style={emptyStyle}/>
      );
    }
    slice = (
      <path style={filledStyle} d={`
            M 0 ${SIZE}
            L ${D} 0
            L ${D + (numerator - 1) * W / (denominator - 2)} 0
            L ${D + (numerator - 1) * W / (denominator - 2)} ${SIZE}
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

