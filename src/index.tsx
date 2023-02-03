import React from 'react';
import {createRoot} from 'react-dom/client';

import {KM, KMID} from './knowledge-map';
import type {DepGraph} from './dependency-graph';

interface KnowledgeNodeProps {
  kmid: keyof typeof KMID,
  depth: number,
  offset: number,
  dependants?: KnowledgeNodeProps[],
};

let WIDTH = 350;
let W_PADDING = 100;
let HEIGHT = 75;
let H_PADDING = 10;
let nodePos = (depth: number, offset: number) => {
  return {
    x: depth * (WIDTH + W_PADDING),
    y: offset * (HEIGHT + H_PADDING),
  };
};

let KnowledgeNode = (props: KnowledgeNodeProps) => {
  let pos = nodePos(props.depth, props.offset);
  let dependants = [];
  if (props.dependants) {
    for (let i = 0; i < props.dependants.length; ++i) {
      let dependant = props.dependants[i];
      let dependantPos = nodePos(dependant.depth, dependant.offset);
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
      let bbox = ref.current!.getBBox();
      console.log('bbox');
      console.log(bbox);
      setWidth(bbox.width);
      setHeight(bbox.height);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  let topSorted = KM.overallOrder();
  let layerSizes = [];
  let offsetMap = new Map();
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i] as keyof typeof KMID;
    let depth = KM.memoizedDepth(node);
    while (layerSizes.length <= depth) {
      layerSizes.push(0);
    }
    layerSizes[depth] += 1;
    offsetMap.set(node, {
      kmid: node,
      depth: depth,
      offset: layerSizes[depth] - 1,
    });
  }

  let nodes = [];
  for (let i = 0; i < topSorted.length; ++i) {
    let node = topSorted[i] as keyof typeof KMID;
    let dependants = KM.directDependantsOf(node).map(x => offsetMap.get(x));
    nodes.push(
      <KnowledgeNode key={node}
          kmid={node}
          depth={offsetMap.get(node).depth}
          offset={offsetMap.get(node).offset}
          dependants={dependants}/>
    );
  }

  return (
    <svg width={width}
        height={height}
        ref={ref}
        xmlns="<http://www.w3.org/2000/svg>">
      {nodes}
    </svg>
  );
};

let App = (props: any) => {
  return (
    <KnowledgeMap/>
  );
};

let root = createRoot(document.getElementById('content')!);
root.render(<App/>);
