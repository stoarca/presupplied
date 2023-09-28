import React from 'react';
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import {moduleComponents} from './ModuleContext';
import {StudentContext} from './StudentContext';
import {buildGraph, TechTree} from './dependency-graph';
import {AdminToolbar, TOOLBAR_WIDTH} from './AdminToolbar';
import {Cell} from './types';
import {GraphJson} from '../../common/types';
import {clamp} from './util';
import _KNOWLEDGE_MAP from '../../static/knowledge-map.json';
let KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

let autoIncrementingId = 0;
let genId = () => {
  return ++autoIncrementingId;
};

let CELL_WIDTH = 300;
let CELL_W_PADDING = 75;
let CELL_HEIGHT = 75;
let CELL_H_PADDING = 10;
let nodePos = (cell: Cell) => {
  let ret = {
    x: cell.j * (CELL_WIDTH + CELL_W_PADDING),
    y: cell.i * (CELL_HEIGHT + CELL_H_PADDING),
  };
  return ret;
};
let cellFromAbsoluteCoords = (x: number, y: number): Cell | null => {
  if (
    y % (CELL_HEIGHT + CELL_H_PADDING) > CELL_HEIGHT ||
    x % (CELL_WIDTH + CELL_W_PADDING) > CELL_WIDTH
  ) {
    return null;
  }
  return {
    i: Math.floor(y / (CELL_HEIGHT + CELL_H_PADDING)),
    j: Math.floor(x / (CELL_WIDTH + CELL_W_PADDING)),
  };
};

interface KnowledgeNodePropsLite {
  kmid: string,
  cell: Cell,
  progress: 'reached' | 'reachable' | 'unreachable'
}

interface KnowledgeNodeProps extends KnowledgeNodePropsLite {
  dependants: KnowledgeNodePropsLite[],
  selectedCells: Cell[],
};

let KnowledgeNode = (props: KnowledgeNodeProps) => {
  let pos = nodePos(props.cell);
  let dependants = [];
  let selectedDependants = [];
  let isSelectedMe = props.selectedCells.some(
    x => x.i === props.cell.i && x.j === props.cell.j
  );
  for (let i = 0; i < props.dependants.length; ++i) {
    let dependant = props.dependants[i];
    let dependantPos = nodePos(dependant.cell);
    let isSelectedDep = props.selectedCells.some(
      x => x.i === dependant.cell.i && x.j === dependant.cell.j
    );
    dependants.push(
      <line key={'dep-' + props.kmid + '-' + dependant.kmid}
          x1={CELL_WIDTH}
          y1={CELL_HEIGHT / 2}
          x2={dependantPos.x - pos.x}
          y2={dependantPos.y - pos.y + CELL_HEIGHT / 2}
          strokeWidth={isSelectedDep || isSelectedMe ? 5 : 2}
          stroke={isSelectedDep || isSelectedMe ? "blue" : "black"}/>
    );
    if (isSelectedDep) {
      selectedDependants.push(
        <circle key={'sel-' + props.kmid + '-' + dependant.kmid}
          cx={CELL_WIDTH}
          cy={CELL_HEIGHT / 2}
          r={10}
          fill="blue"/>
      );
    }
    if (isSelectedMe) {
      selectedDependants.push(
        <circle key={'selme-' + props.kmid + '-' + dependant.kmid}
          cx={dependantPos.x - pos.x}
          cy={dependantPos.y - pos.y + CELL_HEIGHT / 2}
          r={10}
          fill="blue"/>
      );
    }
  }

  let fill: string;
  if (props.progress === 'reached') {
    fill = '#90EE90';
  } else if (props.progress === 'reachable') {
    fill = '#F1EB9C';
  } else {
    fill = '#777777';
  }
  let opacity = 1;
  if (!moduleComponents[props.kmid]) {
    opacity=0.3;
  }
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`} opacity={opacity}>
      <rect x="0" y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill={fill}/>
      <text dominantBaseline="central" y={CELL_HEIGHT / 2}>{props.kmid}</text>
      {dependants}
      {selectedDependants}
    </g>
  );
};

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

let pixelToViewBoxDist = (
  pos: {x: number, y: number},
  viewBox: ViewBox
): {x: number, y: number} => {
  let aspectRatio = window.innerWidth / window.innerHeight;
  let w = viewBox.w;
  let h = viewBox.h;
  if (aspectRatio > 1) {
    h = w / aspectRatio;
  } else {
    w = h * aspectRatio;
  }
  return {
    x: pos.x / window.innerWidth * w,
    y: pos.y / window.innerHeight * h,
  };
}

let getMouseXY = (
  e: MouseEvent | React.MouseEvent<HTMLElement> | React.MouseEvent<SVGElement>,
  viewBox: ViewBox,
) => {
  let ret = pixelToViewBoxDist({x: e.clientX, y: e.clientY}, viewBox);
  return {
    x: ret.x + viewBox.x,
    y: ret.y + viewBox.y,
  };
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type RME = React.MouseEvent<SVGSVGElement>;
type RTE = React.TouchEvent<SVGSVGElement>;

interface ZoomStart {
  mouse: {x: number, y: number};
  viewBox: ViewBox;
  totalZoom: number;
}
interface PanZoomSvgProps extends Omit<React.SVGProps<SVGSVGElement>, 'viewBox'> {
  viewBox: ViewBox;
  viewLimitBox?: ViewBox;
  minZoomWidth: number;
  maxZoomWidth: number;
  onUpdateViewBox: (viewBox: ViewBox) => void;
}
export let PanZoomSvg: React.FC<PanZoomSvgProps> = ({
  viewBox,
  viewLimitBox,
  minZoomWidth,
  maxZoomWidth,
  onUpdateViewBox,
  onMouseDown,
  onMouseMove,
  onMouseUp,
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

  console.log('actual viewbox ' + JSON.stringify(viewBox, undefined, 2));

  React.useLayoutEffect(() => {
    let constrained = constrainedViewBox(viewBox);
    console.log('trying to constrain ' + JSON.stringify(viewBox, undefined, 2));
    console.log('constraining to ' + JSON.stringify(constrained, undefined, 2));
    if (
      constrained.x !== viewBox.x ||
      constrained.y !== viewBox.y ||
      constrained.w !== viewBox.w ||
      constrained.h !== viewBox.h
    ) {
      console.log('updating constrained viwebox');
      onUpdateViewBox(constrained);
    }
  }, [viewBox, constrainedViewBox, onUpdateViewBox]);

  let [zoomState, setZoomState] = React.useState<ZoomStart | null>(null);
  React.useLayoutEffect(() => {
    // HACK: Manually attach listener because react does passive: true
    let zoom = (e: WheelEvent) => {
      let dz = e.deltaY < 0 ? 1.05 : 1 / 1.05;
      if (viewBox.w / dz > maxZoomWidth) {
        dz = viewBox.w / maxZoomWidth;
      }
      if (viewBox.w / dz < minZoomWidth) {
        dz = viewBox.w / minZoomWidth;
      }

      let zs;
      if (!zoomState) {
        zs = {
          mouse: getMouseXY(e, viewBox),
          viewBox: viewBox,
          totalZoom: dz,
        };
      } else {
        zs = {
          ...zoomState,
          totalZoom: dz * zoomState.totalZoom,
        };
      }

      let dx = zs.mouse.x - zs.viewBox.x;
      let dy = zs.mouse.y - zs.viewBox.y;

      setZoomState(zs);
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

        x: zs.mouse.x - dx / zs.totalZoom,
        y: zs.mouse.y - dy / zs.totalZoom,
        w: zs.viewBox.w / zs.totalZoom,
        h: zs.viewBox.h / zs.totalZoom,
      }));
    };
    let pan = (e: WheelEvent) => {
      setZoomState(null);
      let {x, y} = pixelToViewBoxDist({x: e.deltaX, y: e.deltaY}, viewBox);
      onUpdateViewBox(constrainedViewBox({
        x: viewBox.x + x,
        y: viewBox.y + y,
        w: viewBox.w,
        h: viewBox.h,
      }));
    };
    let handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        zoom(e);
      } else {
        pan(e);
      }
    };
    let cur = ref.current!;
    cur.addEventListener('wheel', handleWheel);
    return () => cur.removeEventListener('wheel', handleWheel);
  }, [viewBox, onUpdateViewBox, zoomState, minZoomWidth, maxZoomWidth]);

  let action = React.useRef<'zoom' | 'drag' | null>(null);
  let startDrag = React.useRef({mouse: {x: 0, y: 0}, viewBox: viewBox});
  let handleMouseDown = React.useCallback((e: RME) => {
    onMouseDown && onMouseDown(e);
    action.current = 'drag';
    startDrag.current = {mouse: getMouseXY(e, viewBox), viewBox: viewBox};
  }, [viewBox, onMouseDown]);

  let handleMouseMove = React.useCallback((e: RME) => {
    setZoomState(null);
    onMouseMove && onMouseMove(e);
    if (!(e.buttons & 1)) {
      // If the mouse is dragged off the screen, we will not receive a mouseup
      // event. So we check if the primary button is still pressed while
      // moving and disable drag if not.
      action.current = null;
    }
    if (action.current === 'drag') {
      let vb = startDrag.current.viewBox;
      let mouse = getMouseXY(e, vb);
      console.log('dragging');
      console.log(startDrag.current.mouse);
      console.log(mouse);
      vb = {
        ...vb,
        x: vb.x + startDrag.current.mouse.x - mouse.x,
        y: vb.y + startDrag.current.mouse.y - mouse.y,
      };
      let constrained = constrainedViewBox(vb);
      onUpdateViewBox(constrained);
    }
  }, [onMouseMove]);

  let handleMouseUp = React.useCallback((e: RME) => {
    setZoomState(null);
    action.current = null;
    onMouseUp && onMouseUp(e);
  }, [onMouseUp]);

  let handleTouchStart = React.useCallback((e: RTE) => {
    console.log('got touch start');
    onTouchStart && onTouchStart(e);
    if (e.defaultPrevented) {

    }
  }, [onTouchStart]);

  let handleTouchMove = React.useCallback((e: RTE) => {
    onTouchMove && onTouchMove(e);
  }, [onTouchMove]);

  let handleTouchEnd = React.useCallback((e: RTE) => {
    onTouchEnd && onTouchEnd(e);
  }, [onTouchEnd]);

  return (
    <svg ref={ref}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...svgProps}/>
  );
};

type NodeMap = Map<string, KnowledgeNodePropsLite>;
interface BaseKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][];
  rows: number;
  cols: number;
  nodeMap: NodeMap;
  reachable: Set<string>;
  selectedCells: Cell[];
  allowHoverEmptyCell: boolean;
  onHoverCellUpdated?: (cell: Cell | null) => void;
  onMouseDown?: React.SVGProps<SVGSVGElement>['onMouseDown'];
  onMouseUp?: React.SVGProps<SVGSVGElement>['onMouseUp'];
  onClick?: React.SVGProps<SVGSVGElement>['onClick'];
}
export let BaseKnowledgeMap = ({
  knowledgeGraph,
  grid,
  rows,
  cols,
  nodeMap,
  reachable,
  selectedCells,
  allowHoverEmptyCell,
  onHoverCellUpdated,
  onMouseDown,
  onMouseUp,
  onClick,
}: BaseKnowledgeMapProps) => {
  let [viewBox, setViewBox] = React.useState<ViewBox>(() => {
    let url = new URL(window.location.href);
    let scrollTo = url.searchParams.get('scroll');
    let minCell;
    if (scrollTo && nodeMap.get(scrollTo)) {
      minCell = nodeMap.get(scrollTo)!.cell;
    } else {
      minCell = {i: 1000, j: 1000};
      let enabledMinCell = {i: 1000, j: 1000};
      for (let kmid of reachable) {
        let nodeProps = nodeMap.get(kmid)!;
        if (
          nodeProps.cell.j < minCell.j ||
          nodeProps.cell.j === minCell.j && nodeProps.cell.i < minCell.i
        ) {
          minCell = nodeProps.cell;
        }
        if (
          !!moduleComponents[kmid] && (
            nodeProps.cell.j < enabledMinCell.j ||
            nodeProps.cell.j === enabledMinCell.j &&
                nodeProps.cell.i < enabledMinCell.i
          )
        ) {
          enabledMinCell = nodeProps.cell;
        }
      }
      if (enabledMinCell.i < 1000) {
        minCell = enabledMinCell;
      }
    }
    let pos = nodePos(minCell);
    return {
      x: pos.x - window.innerWidth / 2,
      y: pos.y - window.innerHeight / 2,
      w: 2000,
      h: 2000,
    };
  });

  let topSorted = React.useMemo(() => {
    let ret = knowledgeGraph.overallOrder();
    return ret;
  }, [knowledgeGraph]);

  let [hoverCell, _setHoverCell] = React.useState<Cell | null>(null);
  let setHoverCell = React.useCallback((cell: Cell | null) => {
    _setHoverCell(cell);
    if (onHoverCellUpdated) {
      onHoverCellUpdated(cell);
    }
  }, []);

  let handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    let m = getMouseXY(e, viewBox);
    let newHoverCell = cellFromAbsoluteCoords(m.x, m.y);
    if (newHoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }

    if (
      newHoverCell.i < 0 ||
      newHoverCell.j < 0 ||
      newHoverCell.i >= rows ||
      newHoverCell.j >= cols
    ) {
      setHoverCell(null);
      return;
    }

    if (!allowHoverEmptyCell) {
      let hoverNodeId = grid[newHoverCell.i][newHoverCell.j];
      if (!hoverNodeId) {
        setHoverCell(null);
        return;
      }
    }

    if (hoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }

    if (newHoverCell.i !== hoverCell.i || newHoverCell.j !== hoverCell.j) {
      setHoverCell(newHoverCell);
      return;
    }
  }, [hoverCell, grid, rows, cols, allowHoverEmptyCell, viewBox]);

  let nodes = [];
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i];
    let dependants = knowledgeGraph.directDependantsOf(node).map(
      x => nodeMap.get(x)!
    );
    nodes.push(
      <KnowledgeNode key={node}
          kmid={node}
          cell={nodeMap.get(node)!.cell}
          progress={nodeMap.get(node)!.progress}
          dependants={dependants}
          selectedCells={selectedCells}/>
    );
  }

  let selectRects = selectedCells.map(x => {
    let pos = nodePos(x);
    return (
      <rect key={x.i + '_' + x.j}
          x={pos.x}
          y={pos.y}
          width={CELL_WIDTH}
          height={CELL_HEIGHT}
          fill="#00ccee66"/>
    )
  });

  let hoverRect = null;
  if (hoverCell) {
    let pos = nodePos(hoverCell);
    hoverRect = (
      <rect
          x={pos.x}
          y={pos.y}
          width={CELL_WIDTH}
          height={CELL_HEIGHT}
          fill="#00ccee33"/>
    );
  }

  let originMarker = null;
  if (allowHoverEmptyCell) {
    originMarker = (
      <circle
          cx={0}
          cy={0}
          r={CELL_HEIGHT / 3}
          fill="red"/>
    );
  }

  let containerStyle = {
    minWidth: '100%',
    minHeight: '100%',
    width: '100%',
    height: '100%',
    position: 'absolute',
    userSelect: 'none',
    overflow: 'hidden',
  } as React.CSSProperties;
  let svgStyle = {
    minWidth: '100%',
    minHeight: '100%',
  } as React.CSSProperties;
  let viewLimitBox = React.useMemo(() => {
    return {x: -100, y: -100, w: 15000, h: 15000};
  }, []);
  return (
    <div style={containerStyle} onMouseMove={handleMouseMove}>
      <PanZoomSvg
          xmlns="<http://www.w3.org/2000/svg>"
          viewBox={viewBox}
          viewLimitBox={viewLimitBox}
          minZoomWidth={1000}
          maxZoomWidth={100000}
          onUpdateViewBox={setViewBox}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={onClick}
          style={svgStyle}>
        {nodes}
        {selectRects}
        {hoverRect}
        {originMarker}
      </PanZoomSvg>
    </div>
  );
};

interface AdminKnowledgeMapProps {
  knowledgeMap: GraphJson;
  setKnowledgeMap: (knowledgeMap: GraphJson) => void;
  knowledgeGraph: TechTree;
  grid: string[][];
  rows: number;
  cols: number;
  nodeMap: NodeMap;
  reached: Set<string>;
  reachable: Set<string>;
  onChangeReached: (newReached: Set<string>) => void;
  selectedCells: Cell[];
  setSelectedCells: (cells: Cell[]) => void;
}
let AdminKnowledgeMap = ({
  knowledgeMap,
  setKnowledgeMap,
  knowledgeGraph,
  grid,
  rows,
  cols,
  nodeMap,
  reached,
  reachable,
  onChangeReached,
  selectedCells,
  setSelectedCells,
}: AdminKnowledgeMapProps) => {
  let [mode, setMode] = React.useState<'selecting' | null>(null);
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [dragStart, setDragStart] = React.useState<Cell | null>(null);
  let handleMouseDown = React.useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!hoverCell) {
      return;
    }
    setDragStart(hoverCell);
    if (e.shiftKey) {
      setMode('selecting');
    }

    if (e.shiftKey || e.ctrlKey) {
      return;
    }

    let hoverNodeId = grid[hoverCell.i][hoverCell.j];
    if (!hoverNodeId) {
      return;
    }

    let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
    if (!selectedNodeIds.includes(hoverNodeId)) {
      setSelectedCells([hoverCell]);
    }
  }, [hoverCell, selectedCells, grid]);
  let handleMouseUp = React.useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setDragStart(null);
    setMode(null);
    if (!dragStart) {
      return;
    }
    if (!hoverCell) {
      return;
    }

    let di = hoverCell.i - dragStart.i;
    let dj = hoverCell.j - dragStart.j;
    if (di !== 0 || dj !== 0) { // move selection
      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      if (mode === 'selecting') {
        let newlySelectedCells = [];
        let mini = Math.min(hoverCell.i, dragStart.i);
        let maxi = Math.max(hoverCell.i, dragStart.i);
        let minj = Math.min(hoverCell.j, dragStart.j);
        let maxj = Math.max(hoverCell.j, dragStart.j);
        for (let i = mini; i <= maxi; ++i) {
          for (let j = minj; j <= maxj; ++j) {
            if (grid[i][j]) {
              newlySelectedCells.push({i: i, j: j});
            }
          }
        }
        setSelectedCells([...selectedCells, ...newlySelectedCells]);
      } else {
        let isOverlapWithOthers = selectedCells.some(x => {
          let nodeId = grid[x.i + di][x.j + dj];
          return nodeId && !selectedNodeIds.includes(nodeId);
        });
        if (isOverlapWithOthers) {
          console.error('Unable to move due to intersection');
          return;
        }

        let newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          return {
            ...x,
            i: x.i + di,
            j: x.j + dj,
          };
        });
        let newKnowledgeMap = {
          ...knowledgeMap,
          nodes: newNodes,
        };
        setKnowledgeMap(newKnowledgeMap);
        setSelectedCells(selectedCells.map(x => ({i: x.i + di, j: x.j + dj})));
      }
      return;
    }

    if (e.shiftKey) { // shift = modify selection
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (!hoverNodeId) {
        return;
      }

      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      let indexInSelection = selectedNodeIds.indexOf(hoverNodeId);
      if (indexInSelection === -1) { // not in selection, need to add
        setSelectedCells([
          ...selectedCells,
          hoverCell,
        ]);
      } else { // in selection, need to remove
        let newSelectedCells = [
          ...selectedCells
        ]
        newSelectedCells.splice(indexInSelection, 1);
        setSelectedCells(newSelectedCells);
      }
    } else if (e.ctrlKey) { // ctrl = connect selection to target
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (!hoverNodeId) {
        return;
      }

      let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
      let alreadyHasAllConnections = selectedNodeIds.every(
        x => knowledgeMap.nodes.find(y => y.id === x)!.deps.includes(hoverNodeId)
      );
      let newNodes;
      if (alreadyHasAllConnections) {
        newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          return {
            ...x,
            deps: x.deps.filter(y => y !== hoverNodeId),
          };
        });
      } else {
        newNodes = knowledgeMap.nodes.map(x => {
          if (!selectedNodeIds.includes(x.id)) {
            return x;
          }
          if (x.deps.includes(hoverNodeId)) {
            return x;
          }
          return {
            ...x,
            deps: [...x.deps, hoverNodeId],
          };
        });
      }
      let newKnowledgeMap = {
        ...knowledgeMap,
        nodes: newNodes,
      };
      setKnowledgeMap(newKnowledgeMap);
    } else { // create node
      let hoverNodeId = grid[hoverCell.i][hoverCell.j];
      if (hoverNodeId) {
        return;
      }
      setKnowledgeMap({
        ...knowledgeMap,
        nodes: [...knowledgeMap.nodes, {
          id: 'newnode' + genId(),
          i: hoverCell.i,
          j: hoverCell.j,
          deps: [],
        }],
      });
      setSelectedCells([hoverCell]);
    }
  }, [dragStart, hoverCell, grid, knowledgeMap, selectedCells]);

  let handleChangeId = React.useCallback((oldId: string, newId: string) => {
    let oldNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === oldId);
    if (oldNodeIndex === -1) {
      throw new Error('Could not find id ' + oldId);
    }
    let newNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === newId);
    if (newNodeIndex !== -1) {
      throw new Error(newId + ' already exists');
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id === oldId) {
          return {...x, id: newId};
        } else if (x.deps.includes(oldId)) {
          return {...x, deps: x.deps.map(y => y === oldId ? newId : y)};
        } else {
          return x;
        }
      }),
    });
  }, [knowledgeMap]);

  let handleMoveTreeHorz = React.useCallback((id: string, dir: 'left' | 'right') => {
    let updatedCells: {[id: string]: Cell} = {};
    let bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      let curId = bfs.shift()!;
      if (updatedCells[curId]) {
        continue;
      }

      let oldCell = nodeMap.get(curId)!.cell;
      let nextJ = dir === 'left' ? oldCell.j - 1 : oldCell.j + 1;
      if (nextJ < 0) {
        needsNegativeOffset = true;
      }
      updatedCells[curId] = {
        i: oldCell.i,
        j: nextJ,
      };
      if (grid[oldCell.i][nextJ]) {
        bfs.push(grid[oldCell.i][nextJ]);
      }
      let deps: string[];
      if (dir === 'left') {
        deps = knowledgeGraph.directDependenciesOf(curId);
      } else {
        deps = knowledgeGraph.directDependantsOf(curId);
      }
      deps.forEach(x => {
        let depCell = nodeMap.get(x)!.cell;
        if (depCell.j === nextJ) {
          bfs.push(x);
        }
      });
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id in updatedCells) {
          return {...x, ...updatedCells[x.id]};
        } else {
          return x;
        }
      }).map(x => {
        if (needsNegativeOffset) {
          return {...x, j: x.j + 1};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, nodeMap, grid]);
  let handleMoveTreeRight = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'right');
  }, [handleMoveTreeHorz]);
  let handleMoveTreeLeft = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'left');
  }, [handleMoveTreeHorz]);

  let handleMoveTreeVert = React.useCallback((id: string, dir: 'up' | 'down') => {
    let updatedCells: {[id: string]: Cell} = {};
    let lockedCells: string[] = [];
    let idCell = nodeMap.get(id)!.cell;
    if (dir === 'up' && idCell.i < rows || dir === 'down' && idCell.i > 0) {
      let lockedCellId = grid[idCell.i + (dir === 'up' ? 1 : -1)][idCell.j];
      if (lockedCellId) {
        let lockedCell = nodeMap.get(lockedCellId)!.cell;
        lockedCells.push(lockedCellId);
        let cur: string | undefined = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependantsOf(cur).find(
            x => nodeMap.get(x)!.cell.i === lockedCell.i
          );
          if (cur) {
            lockedCells.push(cur);
          }
        }
        cur = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependenciesOf(cur).find(
            x => nodeMap.get(x)!.cell.i === lockedCell.i
          );
          if (cur) {
            lockedCells.push(cur);
          }
        }
      }
    }
    let bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      let curId = bfs.shift()!;
      if (lockedCells.includes(curId)) {
        alert('Attempted to move locked cell. Should never happen!');
        throw new Error('Attempted to move locked cell. Should never happen!');
      }
      if (updatedCells[curId]) {
        continue;
      }

      let oldCell = nodeMap.get(curId)!.cell;
      let nextI = dir === 'up' ? oldCell.i - 1 : oldCell.i + 1;
      if (nextI < 0) {
        needsNegativeOffset = true;
      }
      updatedCells[curId] = {
        i: nextI,
        j: oldCell.j,
      };
      if (grid[nextI][oldCell.j]) {
        bfs.push(grid[nextI][oldCell.j]);
      }
      for (let j = oldCell.j; j < cols; ++j) {
        // if we intersect a horizontal dependency, push both ends of those down
        if (grid[nextI][j]) {
          let deps = knowledgeGraph.directDependenciesOf(grid[nextI][j])
          let sameRowDep = deps.find(x => nodeMap.get(x)!.cell.i === nextI);
          if (sameRowDep && nodeMap.get(sameRowDep)!.cell.j < oldCell.j) {
            bfs.push(sameRowDep);
          }
        }
      }
      let handleDeps = (deps: string[]) => {
        let sameRowDep = deps.find(x => nodeMap.get(x)!.cell.i === oldCell.i);
        if (sameRowDep) {
          bfs.push(sameRowDep);
          let i = oldCell.i;
          while (true) {
            let aboveIds = deps.filter(
              x => nodeMap.get(x)!.cell.i === i - 1 && !lockedCells.includes(x)
            );
            if (aboveIds.length) {
              Array.prototype.push.apply(bfs, aboveIds);
              i -= 1;
            } else {
              break;
            }
          }
          i = oldCell.i;
          while (true) {
            let belowIds = deps.filter(
              x => nodeMap.get(x)!.cell.i === i + 1 && !lockedCells.includes(x)
            );
            if (belowIds.length) {
              Array.prototype.push.apply(bfs, belowIds);
              i += 1;
            } else {
              break;
            }
          }
        }
      };
      handleDeps(knowledgeGraph.directDependantsOf(curId));
      handleDeps(knowledgeGraph.directDependenciesOf(curId));
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id in updatedCells) {
          return {...x, ...updatedCells[x.id]};
        } else {
          return x;
        }
      }).map(x => {
        if (needsNegativeOffset) {
          return {...x, i: x.i + 1};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, nodeMap, grid, cols]);
  let handleMoveTreeUp = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'up');
  }, [handleMoveTreeVert]);
  let handleMoveTreeDown = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'down');
  }, [handleMoveTreeVert]);


  let handleSelectIds = React.useCallback((idsToSelect: string[]) => {
    setSelectedCells(idsToSelect.map(x => nodeMap.get(x)!.cell));
  }, [nodeMap]);

  let handleDeleteIds = React.useCallback((idsToDelete: string[]) => {
    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.filter(x => !idsToDelete.includes(x.id)).map(x => {
        return {...x, deps: x.deps.filter(y => !idsToDelete.includes(y))};
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap]);

  return (
    <div>
      <BaseKnowledgeMap
          knowledgeGraph={knowledgeGraph}
          grid={grid}
          rows={rows}
          cols={cols}
          nodeMap={nodeMap}
          reachable={reachable}
          selectedCells={selectedCells}
          allowHoverEmptyCell={true}
          onHoverCellUpdated={setHoverCell}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}/>
      <AdminToolbar selectedCells={selectedCells}
          grid={grid}
          rows={rows}
          cols={cols}
          reached={reached}
          knowledgeMap={knowledgeMap}
          onChangeId={handleChangeId}
          onChangeReached={onChangeReached}
          onMoveTreeLeft={handleMoveTreeLeft}
          onMoveTreeRight={handleMoveTreeRight}
          onMoveTreeUp={handleMoveTreeUp}
          onMoveTreeDown={handleMoveTreeDown}
          onSelectIds={handleSelectIds}
          onDeleteIds={handleDeleteIds}/>
    </div>
  );
};

interface StudentKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][],
  rows: number,
  cols: number,
  nodeMap: NodeMap;
  reached: Set<string>;
  reachable: Set<string>;
  onChangeReached: (newReached: Set<string>) => void;
  selectedCells: Cell[];
  setSelectedCells: (cells: Cell[]) => void;
}

let StudentKnowledgeMap = ({
  knowledgeGraph,
  grid,
  rows,
  cols,
  nodeMap,
  reached,
  reachable,
  onChangeReached,
  selectedCells,
  setSelectedCells,
}: StudentKnowledgeMapProps) => {
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let handleClick = React.useCallback(async (
    e: React.MouseEvent<SVGSVGElement>
  ) => {
    console.log('click called');
    if (!hoverCell) {
      return;
    }
    if (e.shiftKey) {
      let kmid = grid[hoverCell.i][hoverCell.j];
      let resp = await fetch('/api/learning/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moduleVanityId: kmid,
          status: reached.has(kmid) ? 'not_attempted' : 'passed',
        }),
      });
      let newReached = new Set(reached);
      if (reached.has(kmid)) {
        newReached.delete(kmid);
      } else {
        newReached.add(kmid);
      }
      onChangeReached(newReached);
      return;
    }
    setSelectedCells([hoverCell]);
  }, [hoverCell, grid, reached]);
  let handleCloseDrawer = React.useCallback(() => {
    console.log('closing drawer');
    setSelectedCells([]);
  }, []);
  let box = null;
  if (selectedCells.length > 0) {
    let kmid = grid[selectedCells[0].i][selectedCells[0].j];
    let contents;
    if (!!moduleComponents[kmid]) {
      contents = (
        <List>
          <ListItemButton component={Link} to={`/modules/${kmid}`}>
            <ListItemText primary="Go to mastery"/>
          </ListItemButton>
        </List>
      );
    } else {
      contents = (
        'Sorry, this module is not implemented yet. Check back soon!'
      );
    }
    box = (
      <Box sx={{width: 350}}>
        <Typography component="h2">
          {kmid}
        </Typography>
        {contents}
      </Box>
    );
  }
  return (
    <div>
      <BaseKnowledgeMap
          knowledgeGraph={knowledgeGraph}
          grid={grid}
          rows={rows}
          cols={cols}
          nodeMap={nodeMap}
          reachable={reachable}
          selectedCells={selectedCells}
          allowHoverEmptyCell={false}
          onHoverCellUpdated={setHoverCell}
          onClick={handleClick}/>
      <Drawer anchor="right"
          open={selectedCells.length > 0}
          onClose={handleCloseDrawer}>
        {box}
      </Drawer>
    </div>
  );
};

export let KnowledgeMap = () => {
  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';

  let student = React.useContext(StudentContext);

  let [knowledgeMap, _setKnowledgeMap] = React.useState(KNOWLEDGE_MAP);
  let setKnowledgeMap = React.useCallback((m: typeof KNOWLEDGE_MAP) => {
    let acc: {[id: string]: number} = {};
    m.nodes.forEach(x => {
      acc[x.id] = (acc[x.id] || 0) + 1;
      if (acc[x.id] !== 1) {
        throw new Error('We tried to set an invalid map! Duplicate id ' + x.id);
      }
    });

    m.nodes.forEach(x => {
      x.deps.forEach(d => {
        if (!acc[d]) {
          throw new Error('Invalid dependency ' + d + ' on ' + x.id);
        }
      });
    });
    _setKnowledgeMap(m);
  }, []);
  let knowledgeGraph = React.useMemo(() => {
    return buildGraph(knowledgeMap);
  }, [knowledgeMap]);
  let {grid, rows, cols} = React.useMemo(() => {
    knowledgeGraph.clearMemo();
    return knowledgeGraph.memoizedGrid();
  }, [knowledgeGraph]);
  let [reached, setReached] = React.useState(new Set<string>(
    student ? student.progress.filter(
      x => x.status === 'passed'
    ).map(
      x => x.moduleVanityId
    ) : undefined
  ));
  let handleChangeReached = React.useCallback((newReached: Set<string>) => {
    setReached(newReached);
  }, []);
  let reachable = React.useMemo(() => {
    let ret = knowledgeGraph.getReachable(reached);
    return ret;
  }, [knowledgeGraph, reached]);
  let nodeMap = React.useMemo(() => {
    let ret = new Map();
    for (let i = 0; i <= rows; ++i) {
      for (let j = 0; j <= cols; ++j) {
        let id = grid[i][j];
        if (id) {
          ret.set(id, {
            kmid: id,
            cell: {i: i, j: j},
            progress: reached.has(id) ? 'reached' :
                reachable.has(id) ? 'reachable':
              'unreachable',
          });
        }
      }
    }
    return ret;
  }, [knowledgeGraph, grid, reached, reachable]);

  let [selectedCells, setSelectedCells] = React.useState<Cell[]>([]);

  let ret;
  if (admin) {
    ret = (
      <AdminKnowledgeMap
          knowledgeMap={knowledgeMap}
          setKnowledgeMap={setKnowledgeMap}
          knowledgeGraph={knowledgeGraph}
          grid={grid}
          rows={rows}
          cols={cols}
          nodeMap={nodeMap}
          reached={reached}
          reachable={reachable}
          onChangeReached={handleChangeReached}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}/>
    );
  } else {
    ret = (
      <StudentKnowledgeMap
          knowledgeGraph={knowledgeGraph}
          grid={grid}
          rows={rows}
          cols={cols}
          nodeMap={nodeMap}
          reached={reached}
          reachable={reachable}
          onChangeReached={handleChangeReached}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}/>
    );
  }
  return (
    <div style={{height: '100%', position: 'relative'}}>
      {ret}
    </div>
  );
}

