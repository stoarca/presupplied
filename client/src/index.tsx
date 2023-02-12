import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import {buildGraph, GraphJson} from './dependency-graph';
import {buildModuleContext, ModuleContext} from './ModuleContext';

import _KNOWLEDGE_MAP from '../../static/knowledge-map.json';
const KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

interface Progress {
  reached: string[],
}

interface Cell {
  i: number,
  j: number,
}

let autoIncrementingId = 0;
let genId = () => {
  return ++autoIncrementingId;
};

let TOOLBAR_WIDTH = '350px';
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

interface ToolbarForOneProps {
  selectedCell: Cell,
  grid: string[][],
  reached: Set<string>,
  reachable: Set<string>,
  onChangeId: (oldId: string, newId: string) => void,
  onChangeReached: (newReached: Set<string>) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
}

let ToolbarForOne = (props: ToolbarForOneProps) => {
  let ref = React.useRef<HTMLInputElement>(null);
  let kmid = props.grid[props.selectedCell.i][props.selectedCell.j];

  let [tempId, setTempId] = React.useState(kmid);
  React.useEffect(() => {
    setTempId(kmid);
    setTimeout(() => {
      ref.current!.focus();
      ref.current!.select();
    }, 0);
  }, [kmid]);
  let handleChangeInput = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempId(e.target.value);
  }, []);

  let handleSubmit = React.useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onChangeId(kmid, tempId);
  }, [kmid, tempId, props.onChangeId]);

  let handleChangeProgress = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newReached = new Set(props.reached);
    if (e.target.checked) {
      newReached.add(kmid);
    } else {
      newReached.delete(kmid);
    }
    props.onChangeReached(newReached);
  }, [kmid, props.reached, props.onChangeReached]);

  let handleMoveTreeLeft = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeLeft(kmid);
  }, [kmid, props.onMoveTreeLeft]);

  let handleMoveTreeRight = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeRight(kmid);
  }, [kmid, props.onMoveTreeRight]);

  let handleMoveTreeUp = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeUp(kmid);
  }, [kmid, props.onMoveTreeUp]);

  let handleMoveTreeDown = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onMoveTreeDown(kmid);
  }, [kmid, props.onMoveTreeDown]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text"
              ref={ref}
              value={tempId}
              onChange={handleChangeInput}/>
        </div>
        <div>
          <button type="submit">Apply</button>
        </div>
      </form>
      <div>
        <label>
          <input type="checkbox"
              checked={props.reached.has(kmid)}
              onChange={handleChangeProgress}/>
          Reached
        </label>
      </div>
      <div>
        <Link to={`/modules/${kmid}`}>
          Go to lesson
        </Link>
      </div>
      <div>
        <button onClick={handleMoveTreeLeft}>Move Tree Left</button>
      </div>
      <div>
        <button onClick={handleMoveTreeRight}>Move Tree Right</button>
      </div>
      <div>
        <button onClick={handleMoveTreeUp}>Move Tree Up</button>
      </div>
      <div>
        <button onClick={handleMoveTreeDown}>Move Tree Down</button>
      </div>
    </div>
  );
};

interface ToolbarProps {
  knowledgeMap: typeof KNOWLEDGE_MAP,
  selectedCells: Cell[],
  grid: string[][],
  reached: Set<string>,
  reachable: Set<string>,
  onChangeId: (oldId: string, newId: string) => void,
  onChangeReached: (newReached: Set<string>) => void,
  onMoveTreeLeft: (id: string) => void,
  onMoveTreeRight: (id: string) => void,
  onMoveTreeUp: (id: string) => void,
  onMoveTreeDown: (id: string) => void,
  onSelectIds: (ids: string[]) => void,
  onDeleteIds: (ids: string[]) => void,
}

let Toolbar = (props: ToolbarProps) => {
  let size = React.useMemo(() => {
    let maxi = 0;
    let maxj = 0;
    for (let i = 0; i < props.grid.length; ++i) {
      for (let j = 0; j < props.grid[i].length; ++j) {
        if (props.grid[i][j]) {
          maxi = Math.max(i, maxi);
          maxj = Math.max(j, maxj);
        }
      }
    }
    return {rows: maxi + 1, cols: maxj + 1};
  }, [props.grid]);

  let forOne = null;
  if (props.selectedCells.length === 1) {
    forOne = (
      <ToolbarForOne
          selectedCell={props.selectedCells[0]}
          grid={props.grid}
          reached={props.reached}
          reachable={props.reachable}
          onChangeId={props.onChangeId}
          onChangeReached={props.onChangeReached}
          onMoveTreeLeft={props.onMoveTreeLeft}
          onMoveTreeRight={props.onMoveTreeRight}
          onMoveTreeUp={props.onMoveTreeUp}
          onMoveTreeDown={props.onMoveTreeDown}/>
    );
  }

  let handleDelete = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onDeleteIds(props.selectedCells.map(x => props.grid[x.i][x.j]));
  }, [props.selectedCells, props.grid, props.onDeleteIds]);
  let forSelected = null;
  if (props.selectedCells.length > 0) {
    forSelected = (
      <div>
        <button onClick={handleDelete}>Delete Selected</button>
      </div>
    );
  }

  let handleSelectAll = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    props.onSelectIds(props.knowledgeMap.nodes.map(x => x.id));
  }, [props.onSelectIds]);

  let downloadJson = React.useCallback((data: any, filename: string) => {
    let blob = new Blob(
      [JSON.stringify(data, undefined, 2)],
      {type: 'text/json'}
    );
    let a = document.createElement('a');
    //a.style = 'display: none';
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.remove();
  }, []);

  let uploadJson = React.useCallback(() => {
    return new Promise((resolve) => {
      let input = document.createElement('input');
      input.type='file';
      document.body.appendChild(input);
      input.addEventListener('change', (e) => {
        if (!input.files) {
          throw new Error('No files specified');
        }
        if (input.files.length !==  1) {
          throw new Error('Wrong number of files uploaded');
        }
        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = (e) => { resolve(JSON.parse(e.target!.result as string)); };
        reader.readAsText(file);
      });
      input.click();
      input.remove();
    });
  }, []);

  let handleExportGraph = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    downloadJson(props.knowledgeMap, 'knowledge-map.json');
  }, [props.knowledgeMap, downloadJson]);

  let handleExportProgress = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    downloadJson({
      reached: Array.from(props.reached),
    }, 'progress.json');
  }, [props.reached]);

  let handleImportProgress = React.useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    let newProgress = await uploadJson() as Progress;
    props.onChangeReached(new Set(newProgress.reached));
  }, [props.onChangeReached]);

  let toolbarStyle = {
    position: 'fixed',
    width: TOOLBAR_WIDTH,
    height: '100%',
    background: 'red',
    top: 0,
    right: 0,
  } as React.CSSProperties;
  return (
    <div style={toolbarStyle}>
      {forOne}
      {forSelected}
      <div>
        <button onClick={handleSelectAll}>Select All</button>
      </div>
      <div>
        <button onClick={handleExportGraph}>Export Graph</button>
      </div>
      <div>
        <button onClick={handleExportProgress}>Export Progress</button>
      </div>
      <div>
        <button onClick={handleImportProgress}>Import Progress</button>
      </div>
      <div>
        {props.knowledgeMap.nodes.length}
      </div>
      <div>
        {size.rows}X{size.cols}
      </div>
    </div>
  );
};

interface KnowledgeNodeProps {
  kmid: string,
  cell: Cell,
  dependants?: KnowledgeNodeProps[],
  progress: 'reached' | 'reachable' | 'unreachable'
};

let KnowledgeNode = (props: KnowledgeNodeProps) => {
  let pos = nodePos(props.cell);
  let dependants = [];
  if (props.dependants) {
    for (let i = 0; i < props.dependants.length; ++i) {
      let dependant = props.dependants[i];
      let dependantPos = nodePos(dependant.cell);
      dependants.push(
        <line key={dependant.kmid}
            x1={CELL_WIDTH}
            y1={CELL_HEIGHT / 2}
            x2={dependantPos.x - pos.x}
            y2={dependantPos.y - pos.y + CELL_HEIGHT / 2}
            strokeWidth="2"
            stroke="black"/>
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
    </g>
  );
};

let KnowledgeMap = () => {
  const ref = React.useRef<SVGSVGElement | null>(null);
  let [width, setWidth] = React.useState(0);
  let [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    let interval = setInterval(() => {
      // TODO: HACK we should not be using setInterval here, but good enough
      // for now
      let bbox = ref.current!.getBBox();
      setWidth(bbox.width + 500);
      setHeight(bbox.height + 500);
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
  let topSorted = React.useMemo(() => {
    let ret = knowledgeGraph.overallOrder();
    return ret;
  }, [knowledgeGraph]);
  let [reached, setReached] = React.useState(new Set<string>());
  let reachable = React.useMemo(() => {
    let ret = knowledgeGraph.getReachable(reached);
    return ret;
  }, [knowledgeGraph, reached]);
  let nodeMap = React.useMemo(() => {
    let ret = new Map<string, KnowledgeNodeProps>();
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


  let [mode, setMode] = React.useState<'selecting' | null>(null);
  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [selectedCells, setSelectedCells] = React.useState<Cell[]>([]);
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

  let handleChangeProgress = React.useCallback((newReached: Set<string>) => {
    setReached(newReached);
  }, []);

  const handleMoveTreeHorz = React.useCallback((id: string, dir: 'left' | 'right') => {
    const updatedCells: {[id: string]: Cell} = {};
    const bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      const curId = bfs.shift()!;
      if (updatedCells[curId]) {
        continue;
      }

      const oldCell = nodeMap.get(curId)!.cell;
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
        const depCell = nodeMap.get(x)!.cell;
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
    debugger;
    const updatedCells: {[id: string]: Cell} = {};
    const bfs = [id];
    let needsNegativeOffset = false;
    while (bfs.length > 0) {
      const curId = bfs.shift()!;
      if (updatedCells[curId]) {
        continue;
      }

      const oldCell = nodeMap.get(curId)!.cell;
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
      const handleDeps = (deps: string[]) => {
        const sameRowDep = deps.find(x => nodeMap.get(x)!.cell.i === oldCell.i);
        if (sameRowDep && sameRowDep !== id) {
          bfs.push(sameRowDep);
          let i = oldCell.i;
          while (true) {
            const aboveIds = deps.filter(x => nodeMap.get(x)!.cell.i === i - 1);
            if (aboveIds.includes(id)) {
              break;
            }
            if (aboveIds.length) {
              Array.prototype.push.apply(bfs, aboveIds);
              i -= 1;
            } else {
              break;
            }
          }
          i = oldCell.i;
          while (true) {
            const belowIds = deps.filter(x => nodeMap.get(x)!.cell.i === i + 1);
            if (belowIds.includes(id)) {
              break;
            }
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
  }, [knowledgeMap, knowledgeGraph, nodeMap, grid]);
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
          dependants={dependants}/>
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
    paddingRight: TOOLBAR_WIDTH,
    userSelect: 'none',
  } as React.CSSProperties;
  let svgStyle = {
    minWidth: '100%',
    minHeight: '100%',
    pointerEvents: 'none',
  } as React.CSSProperties;
  return (
    <div>
      <div style={containerStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}>
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
      <Toolbar selectedCells={selectedCells}
          grid={grid}
          reached={reached}
          reachable={reachable}
          knowledgeMap={knowledgeMap}
          onChangeId={handleChangeId}
          onChangeReached={handleChangeProgress}
          onMoveTreeLeft={handleMoveTreeLeft}
          onMoveTreeRight={handleMoveTreeRight}
          onMoveTreeUp={handleMoveTreeUp}
          onMoveTreeDown={handleMoveTreeDown}
          onSelectIds={handleSelectIds}
          onDeleteIds={handleDeleteIds}/>
    </div>
  );
};

let moduleComponents: {[id: string]: React.ReactElement} = {};
require.context('./modules', true, /^\.\/[^\/]+$/).keys().forEach(moduleName => {
  moduleName = moduleName.substring(2); // strip ./ prefix
  const Lesson = React.lazy(() => import('./modules/' + moduleName));
  moduleComponents[moduleName] = (
    <ModuleContext.Provider value={buildModuleContext(moduleName)}>
      <Lesson/>
    </ModuleContext.Provider>
  );
});
let App = (props: any) => {
  const moduleRoutes = Object.keys(moduleComponents).map(x => {
    return <Route key={x} path={x} element={moduleComponents[x]}/>
  });

  return (
    <Router>
      <React.Suspense fallback={"loading..."}>
        <Routes>
          <Route path="/">
            <Route index element={<KnowledgeMap/>}/>
            <Route path="modules">
              {moduleRoutes}
              <Route path="*" element={<div>module not found</div>}/>
            </Route>
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
};

let root = createRoot(document.getElementById('content')!);
root.render(<App/>);
