import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // capital A
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 100, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x + 100, y: point.y}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x + 50, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 150}},
    ];
  },
  (): Shape[] => { // capital B
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
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 140},
        showArrowhead: false,
      },
      {
        type: 'bezierto',
        c1: {x: point.x + 230, y: point.y + 160},
        c2: {x: point.x + 230, y: point.y + 280},
        point: {x: point.x + 150, y: point.y + 300},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital C
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    let radius = 150;
    let angle = 40 * Math.PI / 180;
    return [
      {
        type: 'moveto',
        point: {
          x: point.x + radius + radius * Math.cos(angle),
          y: point.y + radius - radius * Math.sin(angle),
        }
      },
      {
        type: 'arcto',
        point: {x: point.x, y: point.y + radius},
        rx: radius,
        ry: radius,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {
          x: point.x + radius + radius * Math.cos(-angle),
          y: point.y + radius - radius * Math.sin(-angle)
        },
        rx: radius,
        ry: radius,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
    ];
  },
  (): Shape[] => { // capital D
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
        type: 'bezierto',
        c1: {x: point.x + 300, y: point.y},
        c2: {x: point.x + 300, y: point.y + 300},
        point: {x: point.x, y: point.y + 300},
      }
    ];
  },
  (): Shape[] => { // capital E
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 150}},
      {type: 'moveto', point: {x: point.x, y: point.y + 300}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
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
