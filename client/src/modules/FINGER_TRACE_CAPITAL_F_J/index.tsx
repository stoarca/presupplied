import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // capital F
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
    ];
  },
  (): Shape[] => { // capital G
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
          x: point.x + radius * 2,
          y: point.y + radius,
        },
        rx: radius,
        ry: radius,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
      {type: 'moveto', point: {x: point.x + radius, y: point.y + radius}},
      {
        type: 'lineto',
        point: {x: point.x + radius * 2, y: point.y + radius},
        showArrowhead: false,
      },
      {
        type: 'lineto',
        point: {x: point.x + radius * 2, y: point.y + radius * 2}
      },
    ];
  },
  (): Shape[] => { // capital H
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x + 200, y: point.y}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x, y: point.y + 150}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 150}},
    ];
  },
  (): Shape[] => { // capital I
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
      {type: 'moveto', point: {x: point.x, y: point.y + 300}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital J
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x + 200, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 200, y: point.y + 200},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x, y: point.y + 200},
        rx: 100,
        ry: 100,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 1,
      },
      {type: 'moveto', point: {x: point.x + 100, y: point.y}},
      {type: 'lineto', point: {x: point.x + 300, y: point.y}},
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
