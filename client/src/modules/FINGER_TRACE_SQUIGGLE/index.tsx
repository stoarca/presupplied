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
    return [
      {type: 'moveto', point: points[0]},
      {
        type: 'bezierto',
        c1: points[1],
        c2: points[2],
        point: points[3],
      },
    ];
  },
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
  tool: 'touch',
});


