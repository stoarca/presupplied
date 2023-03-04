import { Bezier } from 'bezier-js';

import {
  ModuleBuilder, Shape
} from '@src/modules/common/TRACING/ModuleBuilder';
import {
  genRandPoints, Point
} from '@src/util';

let VARIANTS = [
  (): Shape[] => {
    let points = genRandPoints(4, {
      paddingFromEdge: 100,
      paddingFromEachOther: 400,
    })
    let bezier = new Bezier(points[0], points[1], points[2], points[3]);
    let simpleBeziers = bezier.reduce();
    console.log(simpleBeziers);
    return [
      {type: 'moveto', point: points[0]},
      ...simpleBeziers.map((x, i): Shape => ({
        type: 'bezierto',
        point: x.points[3],
        c1: x.points[1],
        c2: x.points[2],
        showArrowhead: i === simpleBeziers.length - 1,
      })),
    ];
  },
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
  tool: 'touch',
});


