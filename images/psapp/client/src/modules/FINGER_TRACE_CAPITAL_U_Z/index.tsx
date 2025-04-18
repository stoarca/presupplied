import {ModuleBuilder, Shape} from '@src/modules/common/TRACING/ModuleBuilder';
import {genRandPoints} from '@src/util';

let VARIANTS = [
  (): Shape[] => { // capital U
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 200},
        showArrowhead: false,
      },
      {
        type: 'arcto',
        point: {x: point.x + 200, y: point.y + 200},
        rx: 100,
        ry: 100,
        xrot: 0,
        largeArcFlag: 0,
        sweepFlag: 0,
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
    ];
  },
  (): Shape[] => { // capital V
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 100, y: point.y + 300},
        showArrowhead: false
      },
      {type: 'lineto', point: {x: point.x + 200, y: point.y}},
    ];
  },
  (): Shape[] => { // capital W
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 75, y: point.y + 300},
        showArrowhead: false
      },
      {
        type: 'lineto',
        point: {x: point.x + 150, y: point.y + 75},
        showArrowhead: false
      },
      {
        type: 'lineto',
        point: {x: point.x + 225, y: point.y + 300},
        showArrowhead: false
      },
      {type: 'lineto', point: {x: point.x + 300, y: point.y}},
    ];
  },
  (): Shape[] => { // capital X
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x + 200, y: point.y + 300}},
      {type: 'moveto', point: {x: point.x + 200, y: point.y}},
      {type: 'lineto', point: {x: point.x, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital Y
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {type: 'lineto', point: {x: point.x + 100, y: point.y + 150}},
      {type: 'moveto', point: {x: point.x + 200, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 100, y: point.y + 150},
        showArrowhead: false,
      },
      {type: 'lineto', point: {x: point.x + 100, y: point.y + 300}},
    ];
  },
  (): Shape[] => { // capital Z
    let point = genRandPoints(1, {
      paddingFromEdge: 300,
    })[0];
    point.x -= 150;
    point.y -= 150;
    return [
      {type: 'moveto', point: {x: point.x, y: point.y}},
      {
        type: 'lineto',
        point: {x: point.x + 200, y: point.y},
        showArrowhead: false
      },
      {
        type: 'lineto',
        point: {x: point.x, y: point.y + 300},
        showArrowhead: false
      },
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
