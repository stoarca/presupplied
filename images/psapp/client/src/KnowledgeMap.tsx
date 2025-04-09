import React from 'react';
import {Link} from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import {moduleComponents} from './ModuleContext';
import {useStudentContext} from './StudentContext';
import {PanZoomSvg, PanZoomSvgProps} from './PanZoomSvg';
import {buildGraph, TechTree} from './dependency-graph';
import {AdminToolbar} from './AdminToolbar';
import {Cell} from './types';
import {
  GraphJson, ProgressStatus, KNOWLEDGE_MAP, GraphNodeInfo, VideoInfo
} from '../../common/types';
import {ViewBox, pixelToViewBoxPos, visibleViewBoxSize} from './util';
import {NavBar} from './NavBar';

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

interface KnowledgeNodeProps {
  kmid: string,
  knowledgeGraph: TechTree,
  reached?: Set<string>,
  reachable?: Set<string>,
  dependants: string[],
  selectedCells: Cell[],
  admin: boolean,
};

let KnowledgeNode = ({
  kmid,
  knowledgeGraph,
  reached,
  reachable,
  dependants,
  selectedCells,
  admin,
}: KnowledgeNodeProps) => {
  let node = knowledgeGraph.getNodeData(kmid);
  let pos = nodePos(node.cell);
  let title = node.title;
  let dependantLines = [];
  let selectedDependants = [];
  let isSelectedMe = selectedCells.some(
    x => x.i === node.cell.i && x.j === node.cell.j
  );
  for (let i = 0; i < dependants.length; ++i) {
    let dependant = knowledgeGraph.getNodeData(dependants[i]);
    let dependantPos = nodePos(dependant.cell);
    let isSelectedDep = selectedCells.some(
      x => x.i === dependant.cell.i && x.j === dependant.cell.j
    );
    dependantLines.push(
      <line key={'dep-' + kmid + '-' + dependant.id}
        x1={CELL_WIDTH}
        y1={CELL_HEIGHT / 2}
        x2={dependantPos.x - pos.x}
        y2={dependantPos.y - pos.y + CELL_HEIGHT / 2}
        strokeWidth={isSelectedDep || isSelectedMe ? 5 : 2}
        stroke={isSelectedDep || isSelectedMe ? 'blue' : 'black'}/>
    );
    if (isSelectedDep) {
      selectedDependants.push(
        <circle key={'sel-' + kmid + '-' + dependant.id}
          cx={CELL_WIDTH}
          cy={CELL_HEIGHT / 2}
          r={10}
          fill="blue"/>
      );
    }
    if (isSelectedMe) {
      selectedDependants.push(
        <circle key={'selme-' + kmid + '-' + dependant.id}
          cx={dependantPos.x - pos.x}
          cy={dependantPos.y - pos.y + CELL_HEIGHT / 2}
          r={10}
          fill="blue"/>
      );
    }
  }

  let fill: string;
  if (reached && reached.has(kmid)) {
    fill = '#90EE90';
  } else if (reachable && reachable.has(kmid)) {
    fill = '#F1EB9C';
  } else if (admin && knowledgeGraph.directDependantsOf(kmid).length === 0) {
    fill = '#F19C9C';
  } else {
    fill = '#777777';
  }
  let opacity = 1;
  if (!moduleComponents[kmid]) {
    opacity=0.3;
  }
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`} opacity={opacity}>
      <rect x="0" y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill={fill}/>
      <text dominantBaseline="central" y={CELL_HEIGHT / 2}>
        {title || kmid}
      </text>
      {dependantLines}
      {selectedDependants}
    </g>
  );
};

interface BaseKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][];
  reached?: Set<string>;
  reachable?: Set<string>;
  selectedCells: Cell[];
  admin: boolean;
  onHoverCellUpdated?: (cell: Cell | null) => void;
  onMouseDown?: PanZoomSvgProps['onMouseDown'],
  onMouseUp?: PanZoomSvgProps['onMouseUp'];
  onClick?: PanZoomSvgProps['onClick'];
}
export let BaseKnowledgeMap = ({
  knowledgeGraph,
  grid,
  reached,
  reachable,
  selectedCells,
  admin,
  onHoverCellUpdated,
  onMouseDown,
  onMouseUp,
  onClick,
}: BaseKnowledgeMapProps) => {
  let svgRef = React.useRef<SVGSVGElement | null>(null);
  let [viewBox, setViewBox] = React.useState<ViewBox>({
    x: 0, y: 0, w: 2000, h: 2000
  });
  React.useEffect(() => {
    let url = new URL(window.location.href);
    let scrollTo = url.searchParams.get('scroll');
    let minCell;
    if (scrollTo && knowledgeGraph.hasNode(scrollTo)) {
      minCell = knowledgeGraph.getNodeData(scrollTo).cell;
    } else {
      minCell = {i: 1000, j: 1000};
      let enabledMinCell = {i: 1000, j: 1000};
      if (reachable) {
        for (let kmid of reachable) {
          let nodeCell = knowledgeGraph.getNodeData(kmid).cell;
          if (
            nodeCell.j < minCell.j ||
            nodeCell.j === minCell.j && nodeCell.i < minCell.i
          ) {
            minCell = nodeCell;
          }
          if (
            !!moduleComponents[kmid] && (
              nodeCell.j < enabledMinCell.j ||
              nodeCell.j === enabledMinCell.j && nodeCell.i < enabledMinCell.i
            )
          ) {
            enabledMinCell = nodeCell;
          }
        }
      }
      if (enabledMinCell.i < 1000) {
        minCell = enabledMinCell;
      }
    }
    let pos = nodePos(minCell);
    let {w, h} = visibleViewBoxSize(
      {x: 0, y: 0, w: 2000, h: 2000}, svgRef.current!.getBoundingClientRect()
    );
    setViewBox({
      x: pos.x - w / 2 + CELL_WIDTH / 2,
      y: pos.y - h / 2 + CELL_HEIGHT / 2,
      w: 2000,
      h: 2000,
    });
    // intentionally no args, only want this scroll to happen on page load
  }, []);

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

  let handleMouseMove = React.useCallback((e: MouseEvent) => {
    let m = pixelToViewBoxPos(
      {x: e.clientX, y: e.clientY},
      viewBox,
      (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    );
    let newHoverCell = cellFromAbsoluteCoords(m.x, m.y);
    if (newHoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }

    if (
      newHoverCell.i < 0 ||
      newHoverCell.j < 0 ||
      newHoverCell.i >= grid.length ||
      newHoverCell.j >= grid[0].length
    ) {
      setHoverCell(null);
      return;
    }

    if (!admin) {
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
  }, [hoverCell, grid, admin, viewBox]);

  let nodes = [];
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i];
    let dependants = knowledgeGraph.directDependantsOf(node);
    nodes.push(
      <KnowledgeNode key={node}
        kmid={node}
        knowledgeGraph={knowledgeGraph}
        reached={reached}
        reachable={reachable}
        dependants={dependants}
        selectedCells={selectedCells}
        admin={admin}/>
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
    );
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
  if (admin) {
    originMarker = (
      <circle
        cx={0}
        cy={0}
        r={CELL_HEIGHT / 3}
        fill="red"/>
    );
  }

  let svgStyle = {
    userSelect: 'none',
    flex: '1 1 0',
  } as React.CSSProperties;
  let viewLimitBox = React.useMemo(() => {
    return {x: -100, y: -100, w: 20000, h: 15000};
  }, []);
  return (
    <PanZoomSvg
      xmlns="<http://www.w3.org/2000/svg>"
      ref={svgRef}
      viewBox={viewBox}
      viewLimitBox={viewLimitBox}
      minZoomWidth={1000}
      maxZoomWidth={20000}
      onUpdateViewBox={setViewBox}
      onMouseDown={onMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      onClick={onClick}
      style={svgStyle}>
      {nodes}
      {selectRects}
      {hoverRect}
      {originMarker}
    </PanZoomSvg>
  );
};

interface AdminKnowledgeMapProps {
  knowledgeMap: GraphJson;
  setKnowledgeMap: (knowledgeMap: GraphJson) => void;
  knowledgeGraph: TechTree;
  grid: string[][];
  rows: number;
  cols: number;
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
  selectedCells,
  setSelectedCells,
}: AdminKnowledgeMapProps) => {
  let [mode, setMode] = React.useState<'select' | 'move'>('move');
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [dragStart, setDragStart] = React.useState<Cell | null>(null);
  let handleMouseDown = React.useCallback((
    e: MouseEvent, cancelPanZoom: () => void
  ) => {
    if (!hoverCell) {
      return;
    }
    setDragStart(hoverCell);
    if (e.shiftKey) {
      setMode('select');
    }

    if (e.shiftKey || e.ctrlKey || e.altKey) {
      cancelPanZoom();
      return;
    }

    let hoverNodeId = grid[hoverCell.i][hoverCell.j];
    if (!hoverNodeId) {
      return;
    }

    cancelPanZoom();
    let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
    if (!selectedNodeIds.includes(hoverNodeId)) {
      setSelectedCells([hoverCell]);
    }
  }, [hoverCell, selectedCells, grid]);
  let handleMouseUp = React.useCallback((e: MouseEvent) => {
    setDragStart(null);
    setMode('move');
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
      if (mode === 'select') {
        let op = selectedCells.find(
          x => x.i === dragStart!.i && x.j === dragStart!.j
        ) ? 'remove' : 'add';
        let newSelectedCells = [...selectedCells];
        let mini = Math.min(hoverCell.i, dragStart.i);
        let maxi = Math.max(hoverCell.i, dragStart.i);
        let minj = Math.min(hoverCell.j, dragStart.j);
        let maxj = Math.max(hoverCell.j, dragStart.j);
        for (let i = mini; i <= maxi; ++i) {
          for (let j = minj; j <= maxj; ++j) {
            if (grid[i][j]) {
              if (op === 'add') {
                if (!selectedCells.find(x => x.i === i && x.j === j)) {
                  // TODO: slow find ^
                  newSelectedCells.push({i: i, j: j});
                }
              } else {
                let index = newSelectedCells.findIndex(
                  x => x.i === i && x.j === j
                );
                // TODO: slow find ^
                if (index > -1) {
                  newSelectedCells.splice(index, 1);
                }
              }
            }
          }
        }
        setSelectedCells(newSelectedCells);
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
            cell: {
              i: x.cell.i + di,
              j: x.cell.j + dj,
            },
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
        ];
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
          title: '',
          description: '',
          studentVideos: [],
          teacherVideos: [],
          cell: hoverCell,
          deps: [],
          subNodes: [],
        }],
      });
      setSelectedCells([hoverCell]);
    }
  }, [mode, dragStart, hoverCell, grid, knowledgeMap, selectedCells]);

  let handleChangeNode = React.useCallback((
    oldId: string, newVal: GraphNodeInfo
  ): void => {
    let oldNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === oldId);
    if (oldNodeIndex === -1) {
      throw new Error('Could not find id ' + oldId);
    }
    let newNodeIndex = knowledgeMap.nodes.findIndex(x => x.id === newVal.id);
    if (newNodeIndex !== -1 && newNodeIndex !== oldNodeIndex) {
      throw new Error(newVal.id + ' already exists');
    }

    setKnowledgeMap({
      ...knowledgeMap,
      nodes: knowledgeMap.nodes.map(x => {
        if (x.id === oldId) {
          return {...x, ...newVal};
        } else if (x.deps.includes(oldId)) {
          return {...x, deps: x.deps.map(y => y === oldId ? newVal.id : y)};
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

      let oldCell = knowledgeGraph.getNodeData(curId).cell;
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
        let depCell = knowledgeGraph.getNodeData(x).cell;
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
          return {...x, cell: {...x.cell, j: x.cell.j + 1}};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, grid]);
  let handleMoveTreeRight = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'right');
  }, [handleMoveTreeHorz]);
  let handleMoveTreeLeft = React.useCallback((id: string) => {
    return handleMoveTreeHorz(id, 'left');
  }, [handleMoveTreeHorz]);

  let handleMoveTreeVert = React.useCallback((id: string, dir: 'up' | 'down') => {
    let updatedCells: {[id: string]: Cell} = {};
    let lockedCells: string[] = [];
    let idCell = knowledgeGraph.getNodeData(id).cell;
    if (dir === 'up' && idCell.i < rows || dir === 'down' && idCell.i > 0) {
      let lockedCellId = grid[idCell.i + (dir === 'up' ? 1 : -1)][idCell.j];
      if (lockedCellId) {
        let lockedCell = knowledgeGraph.getNodeData(lockedCellId).cell;
        lockedCells.push(lockedCellId);
        let cur: string | undefined = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependantsOf(cur).find(
            x => knowledgeGraph.getNodeData(x).cell.i === lockedCell.i
          );
          if (cur) {
            lockedCells.push(cur);
          }
        }
        cur = lockedCellId;
        while (cur) {
          cur = knowledgeGraph.directDependenciesOf(cur).find(
            x => knowledgeGraph.getNodeData(x).cell.i === lockedCell.i
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
        throw new Error('Attempted to move locked cell. Should never happen!');
      }
      if (updatedCells[curId]) {
        continue;
      }

      let oldCell = knowledgeGraph.getNodeData(curId).cell;
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
          let deps = knowledgeGraph.directDependenciesOf(grid[nextI][j]);
          let sameRowDep = deps.find(
            x => knowledgeGraph.getNodeData(x).cell.i === nextI
          );
          if (
            sameRowDep &&
            knowledgeGraph.getNodeData(sameRowDep).cell.j < oldCell.j
          ) {
            bfs.push(sameRowDep);
          }
        }
      }
      let handleDeps = (deps: string[]) => {
        let sameRowDep = deps.find(
          x => knowledgeGraph.getNodeData(x).cell.i === oldCell.i
        );
        if (sameRowDep) {
          bfs.push(sameRowDep);
          let i = oldCell.i;
          while (true) {
            let aboveIds = deps.filter(
              x => knowledgeGraph.getNodeData(x).cell.i === i - 1 &&
                  !lockedCells.includes(x)
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
              x => knowledgeGraph.getNodeData(x).cell.i === i + 1 &&
                  !lockedCells.includes(x)
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
          return {...x, cell: {...x.cell, i: x.cell.i + 1}};
        } else {
          return x;
        }
      }),
    });
    setSelectedCells([]);
  }, [knowledgeMap, knowledgeGraph, grid, cols]);
  let handleMoveTreeUp = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'up');
  }, [handleMoveTreeVert]);
  let handleMoveTreeDown = React.useCallback((id: string) => {
    return handleMoveTreeVert(id, 'down');
  }, [handleMoveTreeVert]);

  let handleSelectIds = React.useCallback((idsToSelect: string[]) => {
    setSelectedCells(idsToSelect.map(x => knowledgeGraph.getNodeData(x).cell));
  }, [knowledgeGraph]);

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
        selectedCells={selectedCells}
        admin={true}
        onHoverCellUpdated={setHoverCell}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}/>
      <AdminToolbar selectedCells={selectedCells}
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        rows={rows}
        cols={cols}
        knowledgeMap={knowledgeMap}
        onChangeNode={handleChangeNode}
        onMoveTreeLeft={handleMoveTreeLeft}
        onMoveTreeRight={handleMoveTreeRight}
        onMoveTreeUp={handleMoveTreeUp}
        onMoveTreeDown={handleMoveTreeDown}
        onSelectIds={handleSelectIds}
        onDeleteIds={handleDeleteIds}/>
    </div>
  );
};

interface VideoListProps {
  title: string,
  videoList: VideoInfo[],
}

let VideoList = (props: VideoListProps) => {
  let videoList = props.videoList.map(x => {
    return (
      <ListItem key={x.title}>
        <MuiLink href={x.url}>
          {x.title}
        </MuiLink>
      </ListItem>
    );
  });
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {props.title}
      </Typography>
      <List>
        {videoList}
      </List>
    </React.Fragment>
  );

};

interface StudentKnowledgeMapProps {
  knowledgeGraph: TechTree;
  grid: string[][],
  rows: number,
  cols: number,
  selectedCells: Cell[];
  setSelectedCells: (cells: Cell[]) => void;
}

let StudentKnowledgeMap = ({
  knowledgeGraph,
  grid,
  selectedCells,
  setSelectedCells,
}: StudentKnowledgeMapProps) => {
  let student = useStudentContext();

  let [reached, setReached] = React.useState(new Set<string>(
    Object.entries(student.progress()).filter(
      ([k, v]) => v.status === ProgressStatus.PASSED
    ).map(([k, v]) => k)
  ));
  let handleChangeReached = React.useCallback((newReached: Set<string>) => {
    setReached(newReached);
  }, []);
  let reachable = React.useMemo(() => {
    let ret = knowledgeGraph.getReachable(reached);
    return ret;
  }, [knowledgeGraph, reached]);

  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let handleClick = React.useCallback(async (e: MouseEvent) => {
    if (!hoverCell) {
      return;
    }
    if (e.shiftKey) {
      let kmid = grid[hoverCell.i][hoverCell.j];
      await student.markReached({
        [kmid]: reached.has(kmid) ?
          ProgressStatus.NOT_ATTEMPTED :
          ProgressStatus.PASSED
      });
      let newReached = new Set(reached);
      if (reached.has(kmid)) {
        newReached.delete(kmid);
      } else {
        newReached.add(kmid);
      }
      handleChangeReached(newReached);
      return;
    }
    setSelectedCells([hoverCell]);
  }, [hoverCell, grid, reached, handleChangeReached]);
  let handleCloseDrawer = React.useCallback(() => {
    setSelectedCells([]);
  }, []);
  let box = null;
  if (selectedCells.length > 0) {
    let kmid = grid[selectedCells[0].i][selectedCells[0].j];
    let node = knowledgeGraph.getNodeData(kmid);

    let studentVideos;
    if (node.studentVideos) {
      studentVideos = (
        <VideoList title="Videos for the student"
          videoList={node.studentVideos}/>
      );
    }

    let teacherVideos;
    if (node.teacherVideos) {
      teacherVideos = (
        <VideoList title="Videos for the teacher"
          videoList={node.teacherVideos}/>
      );
    }

    let mastery;
    if (moduleComponents[kmid]) {
      mastery = (
        <Button component={Link} to={`/modules/${kmid}`}>
          Go to mastery
        </Button>
      );
    } else {
      mastery = (
        'Sorry, this module is not implemented yet. Check back soon!'
      );
    }
    box = (
      <Box sx={{width: 550}}>
        <Typography variant="h5" gutterBottom>
          {node.title || kmid}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          {node.description}
        </Typography>
        {studentVideos}
        {teacherVideos}
        {mastery}
      </Box>
    );
  }
  return (
    <React.Fragment>
      <BaseKnowledgeMap
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        reached={reached}
        reachable={reachable}
        selectedCells={selectedCells}
        admin={false}
        onHoverCellUpdated={setHoverCell}
        onClick={handleClick}/>
      <Drawer anchor="right"
        open={selectedCells.length > 0}
        onClose={handleCloseDrawer}>
        {box}
      </Drawer>
    </React.Fragment>
  );
};

export let KnowledgeMap = () => {

  let url = new URL(window.location.href);
  let admin = url.searchParams.get('admin') === '1';

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
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}/>
    );
  }
  let containerStyle: React.CSSProperties = {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <NavBar/>
      <div style={containerStyle}>
        {ret}
      </div>
    </div>
  );
};

