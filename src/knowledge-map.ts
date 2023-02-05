import {DepGraph} from './dependency-graph';
import _KNOWLEDGE_MAP from './knowledge-map.json';

interface GraphNode {
  id: string,
  deps: string[],
  i: number,
  j: number,
}

interface GraphJson {
  nodes: GraphNode[],
}

export const KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

export const buildGraph = (graphJson: GraphJson) => {
  let graph = new DepGraph();

  for (let i = 0; i < graphJson.nodes.length; ++i) {
    let node = graphJson.nodes[i];
    graph.addNode(node.id);
    graph.setNodeData(node.id, {
      i: node.i,
      j: node.j,
    });
  }
  for (let i = 0; i < graphJson.nodes.length; ++i) {
    let node = graphJson.nodes[i];

    for (let j = 0; j < node.deps.length; ++j) {
      if (!graph.hasNode(node.deps[j])) {
        throw new Error(
          node.id + ' has dep on ' + node.deps[j] + ' which does not exist!'
        );
      }
      graph.addDependency(node.id, node.deps[j]);
    }
  }
  return graph;
};
