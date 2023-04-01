import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // lowercase K
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y + 200}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 100}},
      {type: 'moveto', point: {x: point.x, y: point.y + 200}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase L
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase M
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 300},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 225},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x + 150, y: point.y + 225},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 300},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 225},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x + 300, y: point.y + 225},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 300, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase N
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 300},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 225},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x + 150, y: point.y + 225},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase O
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {
        type: 'moveto',
        point: {
          x: point.x + 75 + 75 * Math.cos(45 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(45 * Math.PI / 180),
        }
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 75 + 75 * Math.cos(225 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(225 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 75 + 75 * Math.cos(45 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(45 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
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
