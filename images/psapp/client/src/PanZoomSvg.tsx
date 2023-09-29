import React from 'react';
import {
  clamp,
  midpoint,
  diff,
  dist,
  Point,
  ViewBox,
  pixelToViewBoxPos,
  pixelToViewBoxDist,
} from './util';

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type CancelFunc = () => void;
type HandledEvent = WheelEvent | MouseEvent | TouchEvent;
type CancellableHandler<T extends HandledEvent> = (
  e: T,
  cancelPanZoom: CancelFunc
) => void;

interface StartZoom {
  mouse: Point;
  viewBox: ViewBox;
  totalZoom: number;
  pinchDist?: Point;
}

let runAndCheckIfShouldCancel = <T extends HandledEvent>(
  f: CancellableHandler<T> | undefined,
  e: T
): boolean => {
  let cancel = false;
  f && f(e, () => cancel = true);
  return cancel;
};

export interface PanZoomSvgProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'viewBox' |
      'onWheel' |
      'onMouseDown' |
      'onMouseMove' |
      'onMouseUp' |
      'onClick' |
      'onTouchStart' |
      'onTouchMove' |
      'onTouchEnd'
> {
  viewBox: ViewBox;
  viewLimitBox?: ViewBox;
  minZoomWidth: number;
  maxZoomWidth: number;
  onUpdateViewBox: (viewBox: ViewBox) => void;
  onWheel?: (e: WheelEvent, cancelPanZoom: CancelFunc) => void;
  onMouseDown?: CancellableHandler<MouseEvent>,
  onMouseMove?: (e: MouseEvent, cancelPanZoom: CancelFunc) => void;
  onMouseUp?: (e: MouseEvent, cancelPanZoom: CancelFunc) => void;
  onClick?: (e: MouseEvent, cancelPanZoom: CancelFunc) => void;
  onTouchStart?: (e: TouchEvent, cancelPanZoom: CancelFunc) => void;
  onTouchMove?: (e: TouchEvent, cancelPanZoom: CancelFunc) => void;
  onTouchEnd?: (e: TouchEvent, cancelPanZoom: CancelFunc) => void;
}
export let PanZoomSvg: React.FC<PanZoomSvgProps> = ({
  viewBox,
  viewLimitBox,
  minZoomWidth,
  maxZoomWidth,
  onUpdateViewBox,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  ...svgProps
}: PanZoomSvgProps) => {
  let ref = React.useRef<SVGSVGElement | null>(null);

  let constrainedViewBox = React.useCallback((vb: ViewBox): ViewBox => {
    if (!viewLimitBox) {
      return vb;
    }
    let constrained = {
      x: clamp(
        viewLimitBox.x,
        vb.x,
        viewLimitBox.x + viewLimitBox.w - vb.w
      ),
      y: clamp(
        viewLimitBox.y,
        vb.y,
        viewLimitBox.y + viewLimitBox.h - vb.h
      ),
      w: Math.min(vb.w, viewLimitBox.w),
      h: Math.min(vb.h, viewLimitBox.h),
    };
    return constrained;
  }, [viewLimitBox]);

  React.useLayoutEffect(() => {
    let constrained = constrainedViewBox(viewBox);
    if (
      constrained.x !== viewBox.x ||
      constrained.y !== viewBox.y ||
      constrained.w !== viewBox.w ||
      constrained.h !== viewBox.h
    ) {
      onUpdateViewBox(constrained);
    }
  }, [viewBox, constrainedViewBox, onUpdateViewBox]);

  let action = React.useRef<'zoom' | 'pan' | null>(null);
  let startPan = React.useRef({mouse: {x: 0, y: 0}, viewBox: viewBox});
  let startZoom = React.useRef<StartZoom | null>(null);
  let allowNextClick = React.useRef(true);
  let simulateTouchClick = React.useRef(false);
  React.useLayoutEffect(() => {
    let zoom = (sz: StartZoom, offset?: Point) => {
      if (sz.viewBox.w / sz.totalZoom > maxZoomWidth) {
        sz.totalZoom = sz.viewBox.w / maxZoomWidth;
      }
      if (sz.viewBox.w / sz.totalZoom < minZoomWidth) {
        sz.totalZoom = sz.viewBox.w / minZoomWidth;
      }

      let dx = sz.mouse.x - sz.viewBox.x;
      let dy = sz.mouse.y - sz.viewBox.y;

      startZoom.current = sz;
      onUpdateViewBox(constrainedViewBox({
        // If we slightly zoom in, the old x has to be slightly outside of the
        // new viewBox. Looks something like this:
        //
        //
        //  |        |            |
        //  ^        ^            |
        // v.x      m.x           |
        //  |                     |
        //   <--------v.w-------->
        //
        //     ^ before zoom
        //
        //
        //
        //     |    |      |
        //     ^    ^      |
        //    v.x' m.x     |
        //     |           |
        //      <- -v.w'-->
        //
        //     ^ after zoom
        //
        // m.x is the mouse position
        // v.x is the viewbox position before zoom
        // v.x' is the viewbox position after zoom
        // v.w is the width of the viewbox before zoom
        // v.w' is the width of the viewbox after zoom
        //
        // Note that m.x has to be a fixed point so that if the user alternates
        // between zooming out and in without moving their mouse, their
        // position doesn't change.
        // So then we get:
        //
        // v.w' = v.w / dz (if we zoom in, we are showing a smaller part)
        // dz = v.w / v.w'
        //
        // and we need to solve for v.x':
        //
        // (m.x - v.x) / v.w = (m.x - v.x') / v.w'
        // (m.x - v.x) * v.w' / v.w = m.x - v.x'
        // v.x' = m.x - (m.x - v.x) * v.w' / v.w
        // v.x' = m.x - (m.x - v.x) / dz
        // v.x' = m.x - dx / dz

        x: sz.mouse.x - dx / sz.totalZoom,
        y: sz.mouse.y - dy / sz.totalZoom,
        w: sz.viewBox.w / sz.totalZoom,
        h: sz.viewBox.h / sz.totalZoom,
      }));
    };
    // HACK: Manually attach listener because react does passive: true
    let wheelZoom = (e: WheelEvent) => {
      let dz = e.deltaY < 0 ? 1.05 : 1 / 1.05;

      let sz;
      if (!startZoom.current) {
        sz = {
          mouse: pixelToViewBoxPos({x: e.clientX, y: e.clientY}, viewBox),
          viewBox: viewBox,
          totalZoom: dz,
        };
      } else {
        sz = {
          ...startZoom.current,
          totalZoom: dz * startZoom.current.totalZoom,
        };
      }
      zoom(sz);
    };
    let pan = (e: WheelEvent) => {
      startZoom.current = null;
      let {x, y} = pixelToViewBoxDist({x: e.deltaX, y: e.deltaY}, viewBox);
      onUpdateViewBox(constrainedViewBox({
        x: viewBox.x + x,
        y: viewBox.y + y,
        w: viewBox.w,
        h: viewBox.h,
      }));
    };
    let handleWheel = (e: WheelEvent) => {
      if (runAndCheckIfShouldCancel(onWheel, e)) {
        return;
      }
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        wheelZoom(e);
      } else {
        pan(e);
      }
    };
    let handleMouseDown = (e: MouseEvent) => {
      if (runAndCheckIfShouldCancel(onMouseDown, e)) {
        return;
      }
      e.preventDefault();
      action.current = 'pan';
      startPan.current = {
        mouse: pixelToViewBoxPos({x: e.clientX, y: e.clientY}, viewBox),
        viewBox: viewBox
      };
      allowNextClick.current = true;
    };
    let handleMouseMove = (e: MouseEvent) => {
      startZoom.current = null;
      if (runAndCheckIfShouldCancel(onMouseMove, e)) {
        return;
      }
      e.preventDefault();
      if (!(e.buttons & 1)) {
        // If the mouse is dragged off the screen, we will not receive a mouseup
        // event. So we check if the primary button is still pressed while
        // moving and disable pan if not.
        action.current = null;
      }
      if (action.current === 'pan') {
        allowNextClick.current = false;
        let vb = startPan.current.viewBox;
        let mouse = pixelToViewBoxPos({x: e.clientX, y: e.clientY}, vb);
        vb = {
          ...vb,
          x: vb.x + startPan.current.mouse.x - mouse.x,
          y: vb.y + startPan.current.mouse.y - mouse.y,
        };
        let constrained = constrainedViewBox(vb);
        onUpdateViewBox(constrained);
      }
    };
    let handleMouseUp = (e: MouseEvent) => {
      startZoom.current = null;
      action.current = null;
      if (runAndCheckIfShouldCancel(onMouseUp, e)) {
        return;
      }
      e.preventDefault();
    };
    let handleClick = (e: MouseEvent) => {
      if (allowNextClick.current) {
        if (runAndCheckIfShouldCancel(onClick, e)) {
          return;
        }
      }
      e.preventDefault();
    };
    let handleTouchChange = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        action.current = 'pan';
        startPan.current = {
          mouse: pixelToViewBoxPos(
            {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
            },
            viewBox
          ),
          viewBox: viewBox
        };
      } else if (e.touches.length === 2) {
        action.current = 'zoom';
        let p1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        let p2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        startZoom.current = {
          mouse: pixelToViewBoxPos(midpoint(p1, p2), viewBox),
          viewBox: viewBox,
          totalZoom: 1,
          pinchDist: pixelToViewBoxDist(diff(p1, p2), viewBox),
        };
      } else {
        action.current = null;
      }
    };
    let handleTouchStart = (e: TouchEvent) => {
      if (runAndCheckIfShouldCancel(onTouchStart, e)) {
        return;
      }
      simulateTouchClick.current = e.touches.length === 1;
      e.preventDefault();
      handleTouchChange(e);
    };
    let handleTouchMove = (e: TouchEvent) => {
      simulateTouchClick.current = false;
      if (runAndCheckIfShouldCancel(onTouchMove, e)) {
        return;
      }
      e.preventDefault();
      if (action.current === 'pan') {
        let vb = startPan.current.viewBox;
        let mouse = pixelToViewBoxPos(
          {x: e.touches[0].clientX, y: e.touches[0].clientY},
          vb
        );
        vb = {
          ...vb,
          x: vb.x + startPan.current.mouse.x - mouse.x,
          y: vb.y + startPan.current.mouse.y - mouse.y,
        };
        let constrained = constrainedViewBox(vb);
        onUpdateViewBox(constrained);
      } else if (action.current === 'zoom') {
        let p1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        let p2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        let sz = {...startZoom.current!};
        let origin = {x: 0, y: 0};
        let pinchDist = pixelToViewBoxDist(diff(p1, p2), sz.viewBox);
        sz.totalZoom = dist(pinchDist, origin) / dist(sz.pinchDist!, origin);
        zoom(sz);
      }
    };
    let handleTouchEnd = (e: TouchEvent) => {
      if (runAndCheckIfShouldCancel(onTouchEnd, e)) {
        return;
      }
      if (simulateTouchClick.current) {
        // HACK: we need to preventDefault on all touches because otherwise
        // the performance is really bad. But this means that the mouse events
        // will not fire for touch actions (only touch events will fire).
        // So we need to manually implement the click simulation
        simulateTouchClick.current = false;
        let touch = e.changedTouches[0];
        let me = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
          screenX: touch.screenX,
          screenY: touch.screenY,
        });
        if (runAndCheckIfShouldCancel(onClick, me)) {
          return;
        }
      }
      e.preventDefault();
      handleTouchChange(e);
    };
    let cur = ref.current!;
    cur.addEventListener('wheel', handleWheel);
    cur.addEventListener('mousedown', handleMouseDown);
    cur.addEventListener('mousemove', handleMouseMove);
    cur.addEventListener('mouseup', handleMouseUp);
    cur.addEventListener('click', handleClick);
    cur.addEventListener('touchstart', handleTouchStart);
    cur.addEventListener('touchmove', handleTouchMove);
    cur.addEventListener('touchend', handleTouchEnd);
    return () => {
      cur.removeEventListener('wheel', handleWheel);
      cur.removeEventListener('mousedown', handleMouseDown);
      cur.removeEventListener('mousemove', handleMouseMove);
      cur.removeEventListener('mouseup', handleMouseUp);
      cur.removeEventListener('click', handleClick);
      cur.removeEventListener('touchstart', handleTouchStart);
      cur.removeEventListener('touchmove', handleTouchMove);
      cur.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    viewBox,
    constrainedViewBox,
    minZoomWidth,
    maxZoomWidth,
    onUpdateViewBox,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  ]);

  return (
    <svg ref={ref}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        {...svgProps}/>
  );
};

