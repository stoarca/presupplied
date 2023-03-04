import {
  ModuleBuilder, Shape
} from '@src/modules/common/TRACING/ModuleBuilder';
import {
  genRandPoints, Point, rotate
} from '@src/util';

let VARIANTS = [
  (): Shape[] => {
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    let angle = Math.random() * Math.PI * 2;
    let points = [
      point,
      {x: point.x + 145, y: point.y + 250},
      {x: point.x - 145, y: point.y + 250},
    ].map(x => rotate(x, point, angle));
    if (Math.random() > 0.5) {
      points = [points[0], points[2], points[1]];
    }
    return [
      {type: 'moveto', point: points[0]},
      {type: 'lineto', point: points[1]},
      {type: 'lineto', point: points[2]},
      {type: 'lineto', point: points[0]},
    ];
  },
  (): Shape[] => {
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    let sweep = 0;
    if (Math.random() > 0.5) {
      sweep = 1;
    }
    return [
      {type: 'moveto', point: point},
      {
        type: 'arcto',
        point: {
          ...point,
          x: point.x + 250,
        },
        rx: 125,
        ry: 125,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: sweep,
      },
      {
        type: 'arcto',
        point: point,
        rx: 125,
        ry: 125,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: sweep,
      },
    ];
  },
  (): Shape[] => {
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    let angle = Math.random() * Math.PI * 2;
    let points = [
      point,
      {x: point.x + 250, y: point.y},
      {x: point.x + 250, y: point.y + 250},
      {x: point.x, y: point.y + 250},
    ].map(x => rotate(x, point, angle));
    if (Math.random() > 0.5) {
      points = [points[0], points[3], points[2], points[1]];
    }
    return [
      {type: 'moveto', point: points[0]},
      {type: 'lineto', point: points[1]},
      {type: 'lineto', point: points[2]},
      {type: 'lineto', point: points[3]},
      {type: 'lineto', point: points[0]},
    ];
  },
  (): Shape[] => {
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    let angle = Math.random() * Math.PI * 2;
    let points = [
      point,
      {x: point.x + 200, y: point.y},
      {x: point.x + 300, y: point.y + 250},
      {x: point.x - 100, y: point.y + 250},
    ].map(x => rotate(x, point, angle));
    if (Math.random() > 0.5) {
      points = [points[0], points[3], points[2], points[1]];
    }
    return [
      {type: 'moveto', point: points[0]},
      {type: 'lineto', point: points[1]},
      {type: 'lineto', point: points[2]},
      {type: 'lineto', point: points[3]},
      {type: 'lineto', point: points[0]},
    ];
  },
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 5,
  tool: 'touch',
});


