import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // capital P
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
        point: {x: point.x + 150, y: point.y},
        showArrowhead: false
      },
      {
        type: 'bezierto',
        c1: {x: point.x + 200, y: point.y + 20},
        c2: {x: point.x + 200, y: point.y + 120},
        point: {x: point.x + 150, y: point.y + 140},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x, y: point.y + 140}},
    ];
  },
  (): Shape[] => { // capital Q
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
      {type: 'moveto', point: {x: point.x + 150, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 300, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital R
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
        point: {x: point.x + 150, y: point.y},
        showArrowhead: false
      },
      {
        type: 'bezierto',
        c1: {x: point.x + 200, y: point.y + 20},
        c2: {x: point.x + 200, y: point.y + 120},
        point: {x: point.x + 150, y: point.y + 140},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 140},
        showArrowhead: false
      },
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital S
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {
        type: 'moveto',
        point: {
          x: point.x + 100 + 100 * Math.cos(45 * Math.PI / 180),
          y: point.y + 100 - 100 * Math.sin(45 * Math.PI / 180),
        },
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 100,
          y: point.y,
        },
        rx: 100,
        ry: 100,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 100 + 75 * Math.cos(235 * Math.PI / 180),
          y: point.y + 75 - 75 * Math.sin(235 * Math.PI / 180),
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {
          x: point.x + 100 + 75 * Math.cos(55 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(55 * Math.PI / 180),
        },
        showArrowhead: false
      },
      {
        type: 'arcto',
        point: {x: point.x + 100, y: point.y + 300},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
        showArrowhead: false
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 100 + 100 * Math.cos(225 * Math.PI / 180),
          y: point.y + 200 - 100 * Math.cos(225 * Math.PI / 180),
        },
        rx: 100,
        ry: 100,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
    ];
  },
  (): Shape[] => { // capital T
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 100, y: point.y}},
      {type: 'lineto', point: {x: point.x + 100, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
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
