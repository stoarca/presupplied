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
import {Omit} from '../../common/types';

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

export interface PanZoomDivProps extends Omit<
  React.HTMLProps<HTMLDivElement>,
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
  children: React.ReactNode;
}
export let PanZoomDiv = React.forwardRef<HTMLDivElement, PanZoomDivProps>(({
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
  children,
  style,
  ...divProps
}: PanZoomDivProps, ref) => {
  let innerRef = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => innerRef.current!);
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
        x: sz.mouse.x - dx / sz.totalZoom,
        y: sz.mouse.y - dy / sz.totalZoom,
        w: sz.viewBox.w / sz.totalZoom,
        h: sz.viewBox.h / sz.totalZoom,
      }));
    };
    let wheelZoom = (e: WheelEvent) => {
      let dz = e.deltaY < 0 ? 1.05 : 1 / 1.05;

      let sz;
      if (!startZoom.current) {
        sz = {
          mouse: pixelToViewBoxPos(
            {x: e.clientX, y: e.clientY},
            viewBox,
            innerRef.current!.getBoundingClientRect()
          ),
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
      let domRect = innerRef.current!.getBoundingClientRect();
      let {x, y} = pixelToViewBoxDist(
        {x: e.deltaX, y: e.deltaY},
        viewBox,
        {x: 0, y: 0, width: domRect.width, height: domRect.height},
      );
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
        mouse: pixelToViewBoxPos(
          {x: e.clientX, y: e.clientY},
          viewBox,
          innerRef.current!.getBoundingClientRect(),
        ),
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
        action.current = null;
      }
      if (action.current === 'pan') {
        allowNextClick.current = false;
        let vb = startPan.current.viewBox;
        let mouse = pixelToViewBoxPos(
          {x: e.clientX, y: e.clientY},
          vb,
          innerRef.current!.getBoundingClientRect()
        );
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
            { x: e.touches[0].clientX, y: e.touches[0].clientY },
            viewBox,
            innerRef.current!.getBoundingClientRect(),
          ),
          viewBox: viewBox
        };
      } else if (e.touches.length === 2) {
        action.current = 'zoom';
        let p1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        let p2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        startZoom.current = {
          mouse: pixelToViewBoxPos(
            midpoint(p1, p2), viewBox, innerRef.current!.getBoundingClientRect(),
          ),
          viewBox: viewBox,
          totalZoom: 1,
          pinchDist: pixelToViewBoxDist(
            diff(p1, p2), viewBox, innerRef.current!.getBoundingClientRect(),
          ),
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
          vb,
          innerRef.current!.getBoundingClientRect(),
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
        let pinchDist = pixelToViewBoxDist(
          diff(p1, p2), sz.viewBox, innerRef.current!.getBoundingClientRect()
        );
        sz.totalZoom = dist(pinchDist, origin) / dist(sz.pinchDist!, origin);
        zoom(sz);
      }
    };
    let handleTouchEnd = (e: TouchEvent) => {
      if (runAndCheckIfShouldCancel(onTouchEnd, e)) {
        return;
      }
      if (simulateTouchClick.current) {
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
    let cur = innerRef.current!;
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

  let scale = 1000 / viewBox.w;
  let transformStyle = {
    transform: `scale(${scale}) translate(${-viewBox.x}px, ${-viewBox.y}px)`,
    transformOrigin: '0 0',
  };

  return (
    <div ref={innerRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        ...style
      }}
      {...divProps}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...transformStyle
      }}>
        {children}
      </div>
    </div>
  );
});
