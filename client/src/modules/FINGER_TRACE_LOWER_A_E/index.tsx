import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // lowercase A
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
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase B
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
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
  (): Shape[] => { // lowercase C
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    let radius = 75;
    let angle = 40 * Math.PI / 180;
    return [
      {
        type: 'moveto',
        point: {
          x: point.x + radius + radius * Math.cos(angle),
          y: point.y + 225 - radius * Math.sin(angle),
        }
      },
      {
        type: 'arcto',
        point: {x: point.x, y: point.y + 225},
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
          y: point.y + 225 - radius * Math.sin(-angle)
        },
        rx: radius,
        ry: radius,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
      },
    ];
  },
  (): Shape[] => { // lowercase D
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
      {type: 'moveto', point: {x: point.x + 150, y: point.y}},
      {type: 'lineto', point: {x: point.x + 150, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // lowercase E
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: { x: point.x, y: point.y + 225}},
      {type: 'lineto', point: { x: point.x + 150, y: point.y + 225}},
      {
        type: 'arcto',
        point: {
          x: point.x,
          y: point.y + 225,
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
          x: point.x + 75 + 75 * Math.cos(330 * Math.PI / 180),
          y: point.y + 225 - 75 * Math.sin(330 * Math.PI / 180),
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
