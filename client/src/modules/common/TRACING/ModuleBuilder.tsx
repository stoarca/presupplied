import React from 'react';
import { Bezier } from 'bezier-js';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {SvgArrowhead} from '@src/SvgArrowhead';
import {
  genRandPoints,
  dist,
  clamp,
  projectPointToLine,
  angleBetweenVectors,
  Point,
  VariantList,
} from '@src/util';

import {
  goodDing, badBuzzer, goodJob,
} from '@modules/common/sounds';

type T = React.TouchEvent<HTMLElement>;
type M = React.MouseEvent<HTMLElement>;

interface MoveTo {
  type: 'moveto';
  point: Point;
}

interface LineTo {
  type: 'lineto';
  point: Point;
}

interface BezierTo {
  type: 'bezierto';
  point: Point;
  c1: Point;
  c2: Point;
  showArrowhead: boolean;
}

// must be less than 100 degrees
interface SmallArcTo {
  type: 'arcto';
  point: Point;
  rx: number;
  ry: number;
  xrot: number;
  largeArcFlag: 0;
  sweepFlag: number;
}

export type Shape = MoveTo | LineTo | BezierTo | SmallArcTo;

export type Variant = () => Shape[];

interface MyEx extends Ex<Variant> {
  shapes: Shape[];
}

let shapeToPathPart = (shape: Shape, preShape: Shape | null): string => {
  if (shape.type === 'moveto') {
    return `M ${shape.point.x} ${shape.point.y}`;
  } else if (shape.type === 'lineto') {
    return `L ${shape.point.x} ${shape.point.y}`;
  } else if (shape.type === 'bezierto') {
    return `
      C
      ${shape.c1.x} ${shape.c1.y}
      ${shape.c2.x} ${shape.c2.y}
      ${shape.point.x} ${shape.point.y}
    `;
  } else if (shape.type === 'arcto') {
    return `
      A
      ${shape.rx} ${shape.ry}
      ${shape.xrot}
      ${shape.largeArcFlag}
      ${shape.sweepFlag}
      ${shape.point.x} ${shape.point.y}
    `;
  } else {
    let exhaustiveCheck: never = shape;
    return '';
  }
}

interface ShapeArrowheadProps {
  preShape: Shape,
  shape: Shape,
  [id: string]: any,
}

let ShapeArrowhead: React.FC<ShapeArrowheadProps> = (props) => {
  let {preShape, shape, ...rest} = props;
  let chevronSize = 10;
  if (shape.type === 'moveto') {
    return null;
  } else if (shape.type === 'lineto') {
    return (
      <SvgArrowhead {...rest}
          chevronSize={chevronSize}
          x1={preShape.point.x}
          y1={preShape.point.y}
          x2={shape.point.x}
          y2={shape.point.y}
          />
    );
  } else if (shape.type === 'bezierto') {
    if (!shape.showArrowhead) {
      return null;
    }
    let b = new Bezier(
      preShape.point, shape.c1, shape.c2, shape.point,
    );
    let p = b.get(1);
    let d = b.derivative(1);
    return (
      <SvgArrowhead {...rest}
          chevronSize={chevronSize}
          x1={p.x - d.x}
          y1={p.y - d.y}
          x2={p.x}
          y2={p.y}/>
    );
  } else if (shape.type === 'arcto') {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `
      M ${preShape.point.x} ${preShape.point.y}
      ${shapeToPathPart(shape, preShape)}
    `);
    let len = path.getTotalLength();
    let p = path.getPointAtLength(len - 0.1);
    return (
      <SvgArrowhead {...rest}
          chevronSize={chevronSize}
          x1={p.x}
          y1={p.y}
          x2={shape.point.x}
          y2={shape.point.y}/>
    );
  } else {
    let exhaustiveCheck: never = shape;
    return null;
  }
};

interface ModuleBuilderProps {
  variants: Variant[];
  maxScorePerVariant: number;
  tool: 'mouse' | 'touch' | 'stylus';
}

export let ModuleBuilder = ({
  variants,
  maxScorePerVariant,
  tool,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new VariantList(variants, maxScorePerVariant), []
    );
    let generateExercise = React.useCallback(() => {
      let variant = vlist.pickVariant();
      return {
        variant: variant,
        shapes: variant(),
      };
    }, [vlist]);
    let playInstructions = React.useCallback((exercise: MyEx) => {
      moduleContext.playTTS('Trace the line with your finger.');
    }, [moduleContext]);
    let {
      exercise,
      partial,
      score,
      maxScore,
      doSuccess,
      doPartialSuccess,
      doFailure,
    } = useExercise({
      onGenExercise: generateExercise,
      initialPartial: (): number => 1, // TODO: needs to depend on MoveTo shapes
      onPlayInstructions: playInstructions,
      playOnEveryExercise: false,
      vlist: vlist,
    });

    let ERROR_RADIUS = 70;
    let shapes = exercise.shapes;
    let shapeIndex = Math.floor(partial);
    if (shapeIndex >= shapes.length) {
      shapeIndex -= 1;
    }
    let preShape = React.useMemo(
      () => shapes[shapeIndex - 1], [shapes, shapeIndex]
    );
    let shape: Shape = React.useMemo(
      () => shapes[shapeIndex], [shapes, shapeIndex]
    );
    let percent = React.useMemo(
      () => partial - shapeIndex, [partial, shapeIndex]
    );
    let target = React.useMemo(() => {
      if (shape.type === 'moveto') {
        return shape.point;
      } else if (shape.type === 'lineto') {
        let line = [preShape.point, shape.point];
        return {
          x: line[0].x * (1 - percent) + line[1].x * percent,
          y: line[0].y * (1 - percent) + line[1].y * percent,
        };
      } else if (shape.type === 'bezierto') {
        let b = new Bezier(
          preShape.point, shape.c1, shape.c2, shape.point
        );
        return b.get(percent);
      } else if (shape.type === 'arcto') {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `
          M ${preShape.point.x} ${preShape.point.y}
          ${shapeToPathPart(shape, preShape)}
        `);
        let len = path.getTotalLength();
        let percentLen = len * percent;
        let point = path.getPointAtLength(percentLen);
        return {
          x: point.x,
          y: point.y,
        };
      } else {
        let exhaustiveCheck: never = shape;
        throw new Error('unknown shape type');
      }
    }, [preShape, shape, percent]);
    let [isDragging, setIsDragging] = React.useState(false);
    let handleStart = React.useCallback((e: M | T) => {
      let t = tool === 'touch' ? (e as T).touches[0] : (e as M);
      if (dist({x: t.clientX, y: t.clientY}, target) > ERROR_RADIUS) {
        doFailure();
        return;
      }
      doPartialSuccess(partial);
      setIsDragging(true);
    }, [target, doPartialSuccess, doFailure, partial]);
    let handleMove = React.useCallback((e: M | T) => {
      if (!isDragging) {
        return;
      }
      if (percent >= 1) {
        return;
      }
      let t = tool === 'touch' ? (e as T).touches[0] : (e as M);
      let p = {x: t.clientX, y: t.clientY};
      if (dist(p, target) > ERROR_RADIUS) {
        doFailure();
        return;
      }

      let newPercentMoved: number;
      if (shape.type === 'moveto') {
        throw new Error('should never be here');
      } else if (shape.type === 'lineto') {
        let projectedPoint = projectPointToLine(p, [preShape.point, shape.point]);
        newPercentMoved = clamp(
          (projectedPoint.x - preShape.point.x) /
              (shape.point.x - preShape.point.x),
          0,
          1
        );
      } else if (shape.type === 'bezierto') {
        let b = new Bezier(
          preShape.point, shape.c1, shape.c2, shape.point,
        );
        let projectedPoint = b.project(p);
        let bp = b.get(percent);
        let d = b.derivative(percent);
        let angle = angleBetweenVectors(d, {
          x: projectedPoint.x - bp.x,
          y: projectedPoint.y - bp.y,
        });
        let sign = angle > Math.PI / 2 ? -1 : 1;
        newPercentMoved = clamp(
          percent + sign * dist(projectedPoint, bp) / b.length(),
          0,
          1,
        );
      } else if (shape.type === 'arcto') {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `
          M ${preShape.point.x} ${preShape.point.y}
          ${shapeToPathPart(shape, preShape)}
        `);
        let len = path.getTotalLength();
        let bounds = [0, 1];
        let bisect = () => {
          if (bounds[1] - bounds[0] < 0.001) {
            return;
          }
          let pStart = path.getPointAtLength(bounds[0] * len);
          let pEnd = path.getPointAtLength(bounds[1] * len);
          let mid = (bounds[0] + bounds[1]) / 2;
          let pMid = path.getPointAtLength(mid * len);

          let distStart = dist(p, pStart);
          let distMid = dist(p, pMid);
          let distEnd = dist(p, pEnd);

          if (distStart < distEnd) {
            bounds = [bounds[0], mid];
          } else if (distStart > distEnd) {
            bounds = [mid, bounds[1]];
          } else {
            let pStartMid = path.getPointAtLength((bounds[0] + mid) / 2 * len);
            let pEndMid = path.getPointAtLength((mid + bounds[1]) / 2 * len);
            if (dist(p, pStartMid) < dist(p, pEndMid)) {
              bounds = [bounds[0], mid];
            } else {
              bounds = [mid, bounds[1]];
            }
          }
          bisect();
        };
        bisect();
        newPercentMoved = (bounds[0] + bounds[1]) / 2;
      } else {
        let exhaustiveCheck: never = shape;
        throw new Error('unknown shape type while project');
      }

      if (newPercentMoved >= 0.995) {
        newPercentMoved = 1;
      }
      if (dist(target, shape.point) < 2) {
        newPercentMoved = 1;
      }
      if (newPercentMoved > percent) {
        doPartialSuccess(
          Math.floor(partial) + newPercentMoved, newPercentMoved === 1
        );
      }
    }, [
      preShape,
      shape,
      partial,
      percent,
      target,
      isDragging,
      doFailure,
      doPartialSuccess
    ]);
    let handleEnd = React.useCallback(async (e: M) => {
      setIsDragging(false);
      if (partial < shapes.length) {
        doFailure();
      } else {
        await doSuccess();
      }
    }, [partial, doFailure, doSuccess, shapes]);

    let emptyStyle: React.CSSProperties = {
      fill: 'transparent',
      stroke: '#00000033',
      strokeWidth: 2,
      strokeDasharray: '5,4',
    };
    let emptyPath = (
      <path style={emptyStyle}
          d={shapes.map(
              (x, i) => shapeToPathPart(x, shapes[i] || null)
            ).join(' ')
          }/>
    );
    let targetArrowheads = [];
    for (let i = 0; i < shapes.length; ++i) {
      targetArrowheads.push(
        <ShapeArrowhead key={i}
            style={emptyStyle}
            preShape={shapes[i - 1]}
            shape={shapes[i]}/>
      );
    }

    let nextStyle: React.CSSProperties = {
      ...emptyStyle,
      stroke: '#000000',
    };
    let emptyNext = (
      <path style={nextStyle}
          d={`
            M ${preShape.point.x} ${preShape.point.y}
            ${shapeToPathPart(shape, preShape)}
          `}/>
    );
    let nextArrowhead = (
      <ShapeArrowhead
          style={nextStyle}
          preShape={preShape}
          shape={shape}/>
    );


    let filledStyle: React.CSSProperties = {
      fill: 'transparent',
      stroke: '#ff000033',
      strokeWidth: ERROR_RADIUS,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    };
    let filledPath = (
      <path style={filledStyle}
          d={shapes.map((x, i) => {
            if (i > shapeIndex) {
              return;
            }
            if (x.type === 'moveto') {
              return `M ${x.point.x} ${x.point.y}`;
            } else if (x.type === 'lineto') {
              if (i === shapeIndex) {
                return `
                  L
                  ${shape.point.x * percent + preShape.point.x * (1 - percent)}
                  ${shape.point.y * percent + preShape.point.y * (1 - percent)}
                `;
              } else {
                return `L ${x.point.x} ${x.point.y}`;
              }
            } else if (x.type === 'bezierto') {
              if (i === shapeIndex) {
                if (percent === 0) {
                  return '';
                }
                let b = new Bezier(
                  preShape.point, x.c1, x.c2, x.point,
                );
                let sub = b.split(0, percent);
                return `
                  C
                  ${sub.points[1].x} ${sub.points[1].y}
                  ${sub.points[2].x} ${sub.points[2].y}
                  ${sub.points[3].x} ${sub.points[3].y}
                `;
              } else {
                return `C ${x.c1.x} ${x.c1.y} ${x.c2.x} ${x.c2.y} ${x.point.x} ${x.point.y}`;
              }
            } else if (x.type === 'arcto') {
              if (i === shapeIndex) {
                shape = shape as SmallArcTo;
                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `
                  M ${preShape.point.x} ${preShape.point.y}
                  ${shapeToPathPart(shape, preShape)}
                `);
                let len = path.getTotalLength();
                let percentPoint = path.getPointAtLength(len * percent);
                return shapeToPathPart({
                  ...shape,
                  point: percentPoint,
                }, preShape);
              } else {
                return shapeToPathPart(x, preShape);
              }
            } else {
              let exhaustiveCheck: never = x;
            }
          }).join(' ')}/>
    );

    let targetCircle = (
      <circle r={ERROR_RADIUS / 2} cx={target.x} cy={target.y} fill="#ff000033"/>
    );

    let targetComplete = null;
    if (partial === shapes.length) {
      targetComplete = (
        <circle r={ERROR_RADIUS / 2} cx={target.x} cy={target.y} fill="#00ff0099"/>
      );
    }

    return (
      <Module type="svg"
          score={score}
          maxScore={maxScore}
          onMouseDown={tool === 'mouse' ? handleStart : undefined}
          onMouseMove={tool === 'mouse' ? handleMove : undefined}
          onMouseUp={tool === 'mouse' ? handleEnd : undefined}
          onTouchStart={tool === 'touch' ? handleStart : undefined}
          onTouchMove={tool === 'touch' ? handleMove : undefined}
          onTouchEnd={tool === 'touch'? handleEnd : undefined}>
        {emptyPath}
        {targetArrowheads}
        {emptyNext}
        {nextArrowhead}
        {filledPath}
        {targetCircle}
        {targetComplete}
      </Module>
    );
  }
};

