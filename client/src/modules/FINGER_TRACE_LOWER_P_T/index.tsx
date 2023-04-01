import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // lowercase P
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x, y: point.y + 450}},
      {
        type: 'moveto',
        point: {
          x: point.x + 75 + 75 * Math.cos(135 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(135 * Math.PI / 180),
        },
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 75 + 75 * Math.cos(315 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(315 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 75 + 75 * Math.cos(135 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(135 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
    ];
  },
  (): Shape[] => { // lowercase Q
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
      {type: 'moveto', point: {x: point.x + 150, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 450}},
    ];
  },
  (): Shape[] => { // lowercase R
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
        point: {
          x: point.x + 75 + 75 * Math.cos(30 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(30 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
    ];
  },
  (): Shape[] => { // lowercase S
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 150, y: point.y + 200}},
      {
        type: 'bezierto',
        c1: {x: point.x + 150, y: point.y + 150},
        c2: {x: point.x, y: point.y + 150},
        point: {x: point.x, y: point.y + 200},
        showArrowhead: false,
      },
      {
        type: 'bezierto',
        c1: {x: point.x, y: point.y + 225},
        c2: {x: point.x + 150, y: point.y + 225},
        point: {x: point.x + 150, y: point.y + 250},
        showArrowhead: false,
      },
      {
        type: 'bezierto',
        c1: {x: point.x + 150, y: point.y + 300},
        c2: {x: point.x, y: point.y + 300},
        point: {x: point.x, y: point.y + 250},
      },
    ];
  },
  (): Shape[] => { // lowercase T
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 75, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 75, y: point.y + 225},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x + 150, y: point.y + 300},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 150}},
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
