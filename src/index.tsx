import React from 'react';
import {createRoot} from 'react-dom/client';

import {buildGraph} from './knowledge-map';
import type {DepGraph} from './dependency-graph';

import {KNOWLEDGE_MAP} from './knowledge-map';

interface Cell {
  i: number,
  j: number,
}

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
  onChangeId: (oldId: string, newId: string) => void,
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
    </div>
  );
};

interface ToolbarProps {
  selectedCells: Cell[],
  grid: string[][],
  onChangeId: (oldId: string, newId: string) => void,
}

let Toolbar = (props: ToolbarProps) => {
  if (props.selectedCells.length !== 1) {
    return null;
  }
  return (
    <ToolbarForOne
        selectedCell={props.selectedCells[0]}
        grid={props.grid}
        onChangeId={props.onChangeId}/>
  );
};

interface KnowledgeNodeProps {
  kmid: string,
  cell: Cell,
  dependants?: KnowledgeNodeProps[],
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
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      <rect x="0" y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill="grey"/>
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
      setWidth(bbox.width);
      setHeight(bbox.height);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  let [knowledgeMap, setKnowledgeMap] = React.useState(KNOWLEDGE_MAP);
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

  let [hoverCell, setHoverCell] = React.useState<Cell | null>(null);
  let [selectedCells, setSelectedCells] = React.useState<Cell[]>([]);
  let [dragStart, setDragStart] = React.useState<Cell | null>(null);
  let handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!hoverCell) {
      return;
    }
    setDragStart(hoverCell);

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
  let handleMouseUp = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    setDragStart(null);
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
          id: 'newnode' + knowledgeMap.nodes.length,
          i: hoverCell.i,
          j: hoverCell.j,
          deps: [],
        }],
      });
      setSelectedCells([hoverCell]);
    }
  }, [dragStart, hoverCell, grid, knowledgeMap, selectedCells]);

  let handleChangeId = React.useCallback((oldId: string, newId: string) => {
    let newKnowledgeMap = {
      ...knowledgeMap,
      nodes: [...knowledgeMap.nodes],
    };
    let oldNodeIndex = newKnowledgeMap.nodes.findIndex(x => x.id === oldId);
    if (oldNodeIndex === -1) {
      throw new Error('Could not find id ' + oldId);
    }
    let newNodeIndex = newKnowledgeMap.nodes.findIndex(x => x.id === newId);
    if (newNodeIndex !== -1) {
      throw new Error(newId + ' already exists');
    }
    newKnowledgeMap.nodes[oldNodeIndex] = {
      ...newKnowledgeMap.nodes[oldNodeIndex],
      id: newId,
    };
    for (let i = 0; i < newKnowledgeMap.nodes.length; ++i) {
      let deps = newKnowledgeMap.nodes[i].deps;
      for (let j = 0; j < deps.length; ++j) {
        if (deps[j] === oldId) {
          newKnowledgeMap.nodes[i].deps = [...deps];
          newKnowledgeMap.nodes[i].deps![j] = newId;
        }
      }
    }
    setKnowledgeMap(newKnowledgeMap);
  }, [knowledgeMap]);

  let offsetMap = new Map<string, KnowledgeNodeProps>();
  for (let i = 0; i <= rows; ++i) {
    for (let j = 0; j <= cols; ++j) {
      if (grid[i][j]) {
        offsetMap.set(grid[i][j], {
          kmid: grid[i][j],
          cell: {i: i, j: j},
        });
      }
    }
  }

  let nodes = [];
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i];
    let dependants = knowledgeGraph.directDependantsOf(node).map(
      x => offsetMap.get(x)!
    );
    nodes.push(
      <KnowledgeNode key={node}
          kmid={node}
          cell={offsetMap.get(node)!.cell}
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
          onMouseUp={handleMouseUp}>
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
          onChangeId={handleChangeId}/>
    </div>
  );
};

let App = (props: any) => {
  return (
    <KnowledgeMap/>
  );
};

let root = createRoot(document.getElementById('content')!);
root.render(<App/>);
