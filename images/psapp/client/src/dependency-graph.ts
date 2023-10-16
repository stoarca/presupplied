import {DepGraph} from 'dependency-graph';

import { GraphNode, GraphJson } from '../../common/types';

export class TechTree extends DepGraph<GraphNode> {
  _memoizedDepths!: Map<string, number>;
  _memoizedGrid!: string[][];
  _memoizedRows!: number;
  _memoizedCols!: number;

  constructor() {
    super();
    this.clearMemo();
  }
  memoizedDepth(node: string): number {
    if (this._memoizedDepths.has(node)) {
      return this._memoizedDepths.get(node)!;
    }
    // Must only be called after the graph is finished getting built.
    let deps = this.directDependenciesOf(node);
    let maxDepth = 0;
    for (let i = 0; i < deps.length; ++i) {
      let depthFromThisDep = this.memoizedDepth(deps[i]) + 1;
      if (depthFromThisDep > maxDepth) {
        maxDepth = depthFromThisDep;
      }
    }
    this._memoizedDepths.set(node, maxDepth);
    return maxDepth;
  }
  memoizedGrid(): {grid: string[][], rows: number, cols: number} {
    if (this._memoizedRows === 0 && this._memoizedCols === 0) {
      let topSorted = this.overallOrder();
      topSorted.forEach((node) => {
        let {i, j} = this.getNodeData(node).cell;
        this._memoizedGrid[i][j] = node;
        this._memoizedRows = Math.max(i, this._memoizedRows);
        this._memoizedCols = Math.max(j, this._memoizedCols);
      });
    }

    return {
      grid: this._memoizedGrid,
      rows: this._memoizedRows,
      cols: this._memoizedCols,
    };
  }
  getReachable(reached: Set<string>): Set<string> {
    let reachable = new Set<string>();
    let leaves = this.overallOrder(true);
    leaves.forEach(x => {
      if (!reached.has(x)) {
        reachable.add(x)
      }
    });
    reached.forEach(x => {
      this.directDependentsOf(x).forEach(y => {
        if (this.directDependenciesOf(y).every(z => reached.has(z))) {
          reachable.add(y);
        }
      });
    });
    return reachable;
  }
  clearMemo() {
    // TODO: this can be automatically calculated so that users don't have to
    this._memoizedDepths = new Map();
    this._memoizedGrid = new Array(100).fill(0).map(x => new Array(60));
    this._memoizedRows = 0;
    this._memoizedCols = 0;
  }
}

export const buildGraph = (graphJson: GraphJson) => {
  let graph = new TechTree();

  for (let i = 0; i < graphJson.nodes.length; ++i) {
    let node = graphJson.nodes[i];
    graph.addNode(node.id);
    graph.setNodeData(node.id, node);
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
