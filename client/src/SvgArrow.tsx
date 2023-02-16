import React from 'react';

interface SvgArrowProps {
  chevronSize: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  [id: string]: any,
}

export let SvgArrow: React.FC<SvgArrowProps> = (props) => {
  let {chevronSize, x1, y1, x2, y2, ...rest} = props;
  let v = {
    x: x2 - x1,
    y: y2 - y1,
  };
  let vlen = Math.sqrt(v.x * v.x + v.y * v.y);
  let vperp = {
    x: -v.y,
    y: v.x,
  };
  let unitOffsetPoint = {
    x: x2 - chevronSize * v.x / vlen,
    y: y2 - chevronSize * v.y / vlen,
  };
  let cw45 = {
    x: unitOffsetPoint.x + chevronSize * vperp.x / vlen,
    y: unitOffsetPoint.y + chevronSize * vperp.y / vlen,
  };
  let ccw45 = {
    x: unitOffsetPoint.x - chevronSize * vperp.x / vlen,
    y: unitOffsetPoint.y - chevronSize * vperp.y / vlen,
  };

  return (
    <g>
      <line {...rest} x1={x1} y1={y1} x2={x2} y2={y2}/>
      <line {...rest} x1={cw45.x} y1={cw45.y} x2={x2} y2={y2}/>
      <line {...rest} x1={ccw45.x} y1={ccw45.y} x2={x2} y2={y2}/>
    </g>
  );
};
