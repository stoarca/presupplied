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
  if (!moduleComponents[props.kmid]) {
    fill += '99';
  }
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      <rect x="0" y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill={fill}/>
      <text dominantBaseline="central" y={CELL_HEIGHT / 2}>{props.kmid}</text>
      {dependants}
      {selectedDependants}
    </g>
  );
};

type NodeMap = Map<string, KnowledgeNodePropsLite>;
interface BaseKnowledgeMapProps {
  knowledgeGraph: TechTree;
  nodeMap: NodeMap;
  selectedCells: Cell[];
  onHoverCellUpdated?: (cell: Cell | null) => void;
}
export let BaseKnowledgeMap = ({
  knowledgeGraph,
  nodeMap,
  selectedCells,
  onHoverCellUpdated,
}: BaseKnowledgeMapProps) => {
  let ref = React.useRef<SVGSVGElement | null>(null);
  let [width, setWidth] = React.useState(0);
  let [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    let interval = setInterval(() => {
      // TODO: HACK we should not be using setInterval here, but good enough
      // for now
      let bbox = ref.current!.getBBox();
      setWidth(bbox.width + 200);
      setHeight(bbox.height + 200);
    }, 100);
    return () => clearInterval(interval);
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
  let handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let newHoverCell = cellFromAbsoluteCoords(
      e.clientX - rect.left, e.clientY - rect.top
    );
    if (newHoverCell === null || hoverCell === null) {
      setHoverCell(newHoverCell);
      return;
    }
    if (newHoverCell.i !== hoverCell.i || newHoverCell.j !== hoverCell.j) {
      setHoverCell(newHoverCell);
      return;
    }
  }, [hoverCell]);

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

  let containerStyle = {
    minWidth: '100%',
    minHeight: '100%',
    width: width + 'px',
    height: height + 'px',
    userSelect: 'none',
  } as React.CSSProperties;
  let svgStyle = {
    minWidth: '100%',
    minHeight: '100%',
    pointerEvents: 'none',
  } as React.CSSProperties;
  return (
    <div style={containerStyle} onMouseMove={handleMouseMove}>
      <svg xmlns="<http://www.w3.org/2000/svg>"
          style={svgStyle}
          width={width}
          height={height}
          ref={ref}>
        {nodes}
        {selectRects}
        {hoverRect}
      </svg>
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
  onChangeReached,
  selectedCells,
  setSelectedCells,
}: AdminKnowledgeMapProps) => {
  let [mode, setMode] = React.useState<'selecting' | null>(null);
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [dragStart, setDragStart] = React.useState<Cell | null>(null);
  let handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
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
    let selectedNodeIds = selectedCells.map(x => grid[x.i][x.j]);
    if (hoverNodeId && !selectedNodeIds.includes(hoverNodeId)) {
      setSelectedCells([hoverCell]);
    }
  }, [hoverCell, selectedCells, grid]);
  let handleClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
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
      <div onMouseDown={handleMouseDown} onClick={handleClick}>
        <BaseKnowledgeMap
            knowledgeGraph={knowledgeGraph}
            nodeMap={nodeMap}
            selectedCells={selectedCells}
            onHoverCellUpdated={setHoverCell}
        />
      </div>
      <AdminToolbar selectedCells={selectedCells}
          grid={grid}
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
  nodeMap: NodeMap;
  reached: Set<string>;
  onChangeReached: (newReached: Set<string>) => void;
  selectedCells: Cell[];
  setSelectedCells: (cells: Cell[]) => void;
}

let StudentKnowledgeMap = ({
  knowledgeGraph,
  grid,
  nodeMap,
  reached,
  onChangeReached,
  selectedCells,
  setSelectedCells,
}: StudentKnowledgeMapProps) => {
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let handleClick = React.useCallback(async (
    e: React.MouseEvent<HTMLElement>
  ) => {
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
    setSelectedCells([]);
  }, []);
  let box = null;
  if (selectedCells.length > 0) {
    let kmid = grid[selectedCells[0].i][selectedCells[0].j];
    box = (
      <Box sx={{width: 350}}>
        <Typography component="h2">
          {kmid}
        </Typography>
        <List>
          <ListItemButton component={Link} to={`/modules/${kmid}`}>
            <ListItemText primary="Go to mastery"/>
          </ListItemButton>
        </List>
      </Box>
    );
  }
  return (
    <div onClick={handleClick}>
      <BaseKnowledgeMap
          knowledgeGraph={knowledgeGraph}
          nodeMap={nodeMap}
          selectedCells={selectedCells}
          onHoverCellUpdated={setHoverCell}/>
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

  React.useEffect(() => {
    let url = new URL(window.location.href);
    let scrollTo = url.searchParams.get('scroll');
    let minCell;
    if (scrollTo && nodeMap.get(scrollTo)) {
      minCell = nodeMap.get(scrollTo).cell;
    } else {
      minCell = {
        i: 1000,
        j: 1000,
      };
      for (let kmid of reachable) {
        let nodeProps = nodeMap.get(kmid)!;
        if (
          nodeProps.cell.j < minCell.j ||
          nodeProps.cell.j === minCell.j && nodeProps.cell.i < minCell.i
        ) {
          minCell = nodeProps.cell;
        }
      }
    }
    let pos = nodePos(minCell);
    setTimeout(() => {
      window.scroll(pos.x - window.innerWidth / 2, pos.y - window.innerHeight / 2);
    }, 200);
  }, []); // intentionally empty deps, only run this on mount

  if (admin) {
    return (
      <AdminKnowledgeMap
          knowledgeMap={knowledgeMap}
          setKnowledgeMap={setKnowledgeMap}
          knowledgeGraph={knowledgeGraph}
          grid={grid}
          rows={rows}
          cols={cols}
          nodeMap={nodeMap}
          reached={reached}
          onChangeReached={handleChangeReached}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}/>
    );
  }
  return (
    <StudentKnowledgeMap
        knowledgeGraph={knowledgeGraph}
        grid={grid}
        nodeMap={nodeMap}
        reached={reached}
        onChangeReached={handleChangeReached}
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}/>
  );
}

