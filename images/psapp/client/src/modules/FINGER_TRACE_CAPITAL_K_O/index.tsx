import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // capital K
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital L
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 300},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital M
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 150},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x + 300, y: point.y},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 300, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital N
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 200, y: point.y + 300},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
    ];
  },
  (): Shape[] => { // capital O
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {
        type: 'moveto',
        point: {
          x: point.x + 150 + 150 * Math.cos(45 * Math.PI / 180),
          y: point.y + 150 - 150 * Math.sin(45 * Math.PI / 180),
        }
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 150 + 150 * Math.cos(225 * Math.PI / 180),
          y: point.y + 150 - 150 * Math.sin(225 * Math.PI / 180),
        },
        rx: 150,
        ry: 150,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 150 + 150 * Math.cos(45 * Math.PI / 180),
          y: point.y + 150 - 150 * Math.sin(45 * Math.PI / 180),
        },
        rx: 150,
        ry: 150,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
    ];
  },
];

export default ModuleBuilder({
  variants: VARIANTS,
  maxScorePerVariant: 5,
  tool: 'touch',
  drawRadius: 10,
  errorRadius: 60,
});
