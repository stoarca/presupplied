import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // lowercase F
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 225, y: point.y + 75}},
      {
        type: 'arcto',
        point: {x: point.x + 75, y: point.y + 75},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 75, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 150}},
    ];
  },
  (): Shape[] => { // lowercase G
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
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 375},
        showArrowhead: false
      },
      {
        type: 'arcto',
        point: {
          x: point.x,
          y: point.y + 375,
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      }
    ];
  },
  (): Shape[] => { // lowercase H
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
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 225},
        showArrowhead: false
      },
      {
        type: 'arcto',
        point: {
          x: point.x + 150,
          y: point.y + 225,
        },
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
        showArrowhead: false
      },
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase I
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y + 75}},
      {type: 'lineto', point: {x: point.x, y: point.y + 76}},
    ];
  },
  (): Shape[] => { // lowercase J
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 150, y: point.y + 150}},
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 375},
        showArrowhead: false
      },
      {
        type: 'arcto',
        point: {x: point.x, y: point.y + 375},
        rx: 75,
        ry: 75,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
      {type: 'moveto', point: {x: point.x + 150, y: point.y + 75}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 76}},
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
