import React from 'react';
import {createRoot} from 'react-dom/client';

import {buildGraph} from './knowledge-map';
import type {DepGraph} from './dependency-graph';

import KNOWLEDGE_MAP from './knowledge-map.json';

interface KnowledgeNodeProps {
  kmid: string,
  i: number,
  j: number,
  dependants?: KnowledgeNodeProps[],
};

let WIDTH = 300;
let W_PADDING = 75;
let HEIGHT = 75;
let H_PADDING = 10;
let nodePos = (cell: {i: number, j: number}) => {
  let ret = {
    x: cell.j * (WIDTH + W_PADDING),
    y: cell.i * (HEIGHT + H_PADDING),
  };
  return ret;
};
let cellFromAbsoluteCoords = (x: number, y: number): {i: number, j: number} | null => {
  if (y % (HEIGHT + H_PADDING) > HEIGHT || x % (WIDTH + W_PADDING) > WIDTH) {
    return null;
  }
  return {
    i: Math.floor(y / (HEIGHT + H_PADDING)),
    j: Math.floor(x / (WIDTH + W_PADDING)),
  };
};

let KnowledgeNode = (props: KnowledgeNodeProps) => {
  let pos = nodePos(props);
  let dependants = [];
  if (props.dependants) {
    for (let i = 0; i < props.dependants.length; ++i) {
      let dependant = props.dependants[i];
      let dependantPos = nodePos(dependant);
      dependants.push(
        <line key={dependant.kmid}
            x1={WIDTH}
            y1={HEIGHT / 2}
            x2={dependantPos.x - pos.x}
            y2={dependantPos.y - pos.y + HEIGHT / 2}
            strokeWidth="2"
            stroke="black"/>
      );
    }
  }
  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="grey"/>
      <text dominantBaseline="central" y={HEIGHT / 2}>{props.kmid}</text>
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

  let [mode, setMode] = React.useState<string | null>(null);
  let [hoverCell, setHoverCell] = React.useState<{i: number, j: number} | null>(null);
  let handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.shiftKey) {
      setMode('connect');
    } else {
      setMode('add');
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
  let handleClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (mode === 'add' && hoverCell) {
      setKnowledgeMap({
        ...knowledgeMap,
        nodes: [...knowledgeMap.nodes, {
          id: 'newnode' + knowledgeMap.nodes.length,
          i: hoverCell.i,
          j: hoverCell.j,
        }],
      });
    }
    setMode(null);
  }, [knowledgeMap, mode, hoverCell]);
  let handleMouseUp = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    console.log('mouse up fired');
  }, []);

  let offsetMap = new Map();
  for (let i = 0; i <= rows; ++i) {
    for (let j = 0; j <= cols; ++j) {
      if (grid[i][j]) {
        offsetMap.set(grid[i][j], {
          kmid: grid[i][j],
          i: i,
          j: j,
        });
      }
    }
  }

  let nodes = [];
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i];
    let dependants = knowledgeGraph.directDependantsOf(node).map(
      x => offsetMap.get(x)
    );
    nodes.push(
      <KnowledgeNode key={node}
          kmid={node}
          i={offsetMap.get(node).i}
          j={offsetMap.get(node).j}
          dependants={dependants}/>
    );
  }

  let selectRect = null;
  if (hoverCell) {
    if (mode === null) {
      let pos = nodePos(hoverCell);
      selectRect = (
        <rect x={pos.x} y={pos.y} width={WIDTH} height={HEIGHT} fill="#00ccee33"/>
      );
    }
  }

  let containerStyle = {
    minWidth: '100%',
    minHeight: '100%',
  };
  let style = {
    ...containerStyle,
    pointerEvents: 'none',
  } as React.CSSProperties;
  return (
    <div style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseUp={handleMouseUp}>
      <svg xmlns="<http://www.w3.org/2000/svg>"
          style={style}
          width={width}
          height={height}
          ref={ref}>
        {nodes}
        {selectRect}
      </svg>
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
