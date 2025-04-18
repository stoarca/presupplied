import React from 'react';
import { Bezier } from 'bezier-js';

import {Module, useExercise, Ex} from '@src/Module';
import {ModuleContext} from '@src/ModuleContext';
import {SvgArrowhead} from '@src/SvgArrowhead';
import {
  dist,
  clamp,
  projectPointToLine,
  angleBetweenVectors,
  Point,
  VariantList,
} from '@src/util';

type T = React.TouchEvent<HTMLElement>;
type M = React.MouseEvent<HTMLElement>;
type P = React.PointerEvent<HTMLElement>;

interface MoveTo {
  type: 'moveto';
  point: Point;
}

interface LineTo {
  type: 'lineto';
  point: Point;
  showArrowhead?: boolean;
}

interface BezierTo {
  type: 'bezierto';
  point: Point;
  c1: Point;
  c2: Point;
  showArrowhead?: boolean;
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
  showArrowhead?: boolean;
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
    let exhaustiveCheck: never = shape; // eslint-disable-line
    return '';
  }
};

interface ShapeArrowheadProps {
  preShape: Shape,
  shape: Shape,
  [id: string]: any,
}

let ShapeArrowhead: React.FC<ShapeArrowheadProps> = (props) => {
  let {preShape, shape, ...rest} = props;
  let chevronSize = 10;
  if (shape.type === 'moveto' || shape.showArrowhead === false) {
    return null;
  }

  if (shape.type === 'lineto') {
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
    let exhaustiveCheck: never = shape; // eslint-disable-line
    return null;
  }
};


interface ModuleBuilderProps {
  variants: Variant[];
  maxScorePerVariant: number;
  tool: 'mouse' | 'touch' | 'pen';
  errorRadius: number;
  drawRadius: number;
}

export let ModuleBuilder = ({
  variants,
  maxScorePerVariant,
  tool,
  errorRadius,
  drawRadius,
}: ModuleBuilderProps) => {
  return (props: void) => {
    let moduleContext = React.useContext(ModuleContext);

    let vlist = React.useMemo(
      () => new VariantList(variants.map(v => ({ variant: v, millicards: 1000 })), maxScorePerVariant), []
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

    let shapes = exercise.shapes;
    let shapeIndex = Math.floor(partial);
    if (shapeIndex >= shapes.length || shapes[shapeIndex].type === 'moveto') {
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
        let exhaustiveCheck: never = shape; // eslint-disable-line
        throw new Error('unknown shape type');
      }
    }, [preShape, shape, percent]);
    let [isDragging, setIsDragging] = React.useState(false);
    let [showCursor, setShowCursor] = React.useState(true);
    let handleStart = React.useCallback((e: M | T | P) => {
      setShowCursor((e as P).pointerType === 'mouse');
      if (tool === 'pen' && (e as P).pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      let t = tool === 'touch' ? (e as T).touches[0] : (e as M);
      if (dist({x: t.clientX, y: t.clientY}, target) > errorRadius) {
        doFailure();
        return;
      }
      doPartialSuccess(partial);
      setIsDragging(true);
    }, [target, doPartialSuccess, doFailure, partial]);
    let handleMove = React.useCallback((e: M | T | P) => {
      if (tool === 'pen' && (e as P).pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (!isDragging) {
        return;
      }
      if (shape.type === 'moveto') {
        return;
      }
      let t = tool === 'touch' ? (e as T).touches[0] : (e as M);
      let p = {x: t.clientX, y: t.clientY};
      if (dist(p, target) > errorRadius) {
        doFailure();
        return;
      }

      if (percent >= 1) {
        return;
      }

      let newPercentMoved: number;
      if (shape.type === 'lineto') {
        let projectedPoint = projectPointToLine(p, [preShape.point, shape.point]);
        newPercentMoved = clamp(
          dist(projectedPoint, preShape.point) /
              dist(shape.point, preShape.point),
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

          let distStart = dist(p, pStart);
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
        let exhaustiveCheck: never = shape; // eslint-disable-line
        throw new Error('unknown shape type while project');
      }

      if (newPercentMoved >= 0.995) {
        newPercentMoved = 1;
      }
      if (dist(target, shape.point) < 2) {
        newPercentMoved = 1;
      }
      if (newPercentMoved > percent) {
        let doDingEver = shape.showArrowhead === undefined ||
            shape.showArrowhead === true;
        doPartialSuccess(
          Math.floor(partial) + newPercentMoved,
          doDingEver && newPercentMoved === 1
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
    let handleEnd = React.useCallback(async (e: M | T | P) => {
      if (tool === 'pen' && (e as P).pointerType === 'touch') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      setIsDragging(false);
      if (partial < shapes.length) {
        if (shapes[Math.floor(partial)].type === 'moveto') {
          doPartialSuccess(partial + 1, false);
        } else {
          doFailure();
        }
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
    let joinedArrowheadIndexes = React.useMemo(() => {
      let ret = [];
      let start;
      for (start = shapeIndex - 1; start >= 0; --start) {
        const shape = shapes[start];
        if (
          shape.type === 'moveto' ||
          shape.showArrowhead === undefined ||
          shape.showArrowhead === true
        ) {
          break;
        }
      }
      for (let i = start + 1; i < shapes.length; ++i) {
        const shape = shapes[i];
        if (shape.type === 'moveto') {
          break;
        }
        ret.push(i);
        if (shape.showArrowhead === undefined || shape.showArrowhead === true) {
          break;
        }
      }
      if (ret.length === 0) {
        ret.push(shapeIndex);
      }
      return ret;
    }, [shapes, shapeIndex]);
    let emptyNext = (
      <path className="emptynext" style={nextStyle}
        d={`
            M ${shapes[joinedArrowheadIndexes[0] - 1].point.x}
              ${shapes[joinedArrowheadIndexes[0] - 1].point.y}
            ${joinedArrowheadIndexes.map(i => {
        return shapeToPathPart(shapes[i], shapes[i - 1]);
      })}
          `}/>
    );
    let nextArrowhead = (
      <ShapeArrowhead
        style={nextStyle}
        preShape={
          shapes[joinedArrowheadIndexes[joinedArrowheadIndexes.length - 1] - 1]
        }
        shape={
          shapes[joinedArrowheadIndexes[joinedArrowheadIndexes.length - 1]]
        }/>
    );


    let filledStyle: React.CSSProperties = {
      fill: 'transparent',
      stroke: '#ff000033',
      strokeWidth: drawRadius * 2,
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
              let exhaustiveCheck: never = x; // eslint-disable-line
          }
        }).join(' ')}/>
    );

    let targetCircle = (
      <circle r={drawRadius} cx={target.x} cy={target.y} fill="#ff000033"/>
    );

    let targetComplete = null;
    if (partial === shapes.length || shapes[Math.floor(partial)].type === 'moveto') {
      targetComplete = (
        <circle r={drawRadius} cx={target.x} cy={target.y} fill="#00ff0099"/>
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
        onTouchEnd={tool === 'touch'? handleEnd : undefined}
        onPointerDown={tool === 'pen' ? handleStart : undefined}
        onPointerMove={tool === 'pen' ? handleMove : undefined}
        onPointerUp={tool === 'pen'? handleEnd : undefined}
        extraSvgStyles={{cursor: showCursor ? 'default' : 'none'}}>
        {emptyPath}
        {targetArrowheads}
        {emptyNext}
        {nextArrowhead}
        {filledPath}
        {targetCircle}
        {targetComplete}
      </Module>
    );
  };
};

