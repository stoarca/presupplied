import {
  ModuleBuilder, Shape
} from '@src/modules/common/TRACING/ModuleBuilder';
import {
  genRandPoints, Point
} from '@src/util';

let VARIANTS = [
  (): Shape[] => {
    let points = genRandPoints(2, {
      paddingFromEdge: 200,
      paddingFromEachOther: 400,
    });
    return [
      {type: 'moveto', point: points[0]},
      {type: 'lineto', point: points[1]},
    ];
  },
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 10,
  tool: 'touch',
});


