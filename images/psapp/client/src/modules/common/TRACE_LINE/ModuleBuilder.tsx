import {
  ModuleBuilder as BaseModuleBuilder, Shape
} from '@src/modules/common/TRACING/ModuleBuilder';
import {
  genRandPoints
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

interface ModuleBuilderProps {
  tool: 'mouse' | 'touch' | 'pen';
  errorRadius: number;
  drawRadius: number;
}

export let ModuleBuilder = ({
  tool,
  errorRadius,
  drawRadius,
}: ModuleBuilderProps) => {
  return BaseModuleBuilder({
    variants: VARIANTS,
    maxScorePerVariant: 10,
    tool: tool,
    errorRadius: errorRadius,
    drawRadius: drawRadius,
  });
};


