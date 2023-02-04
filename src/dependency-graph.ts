import {DepGraph as _DepGraph} from 'dependency-graph';

export class DepGraph<T> extends _DepGraph<T> {
  _memoizedDepths!: Map<string, number>;
  _memoizedGrid!: string[][];
  _memoizedRows!: number;
  _memoizedCols!: number;

  constructor() {
    super();
    this.clearMemo();
  }
  addNodeX(node: string, deps?: string[], data?: T) {
    this.addNode(node);
    if (deps !== undefined) {
      for (let i = 0; i < deps.length; ++i) {
        this.addDependency(node, deps[i]);
      }
    }
    if (typeof data !== 'undefined') {
      this.setNodeData(node, data);
    }
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
        let {i, j} = this.getNodeData(node) as {i: number, j: number};
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
  clearMemo() {
    this._memoizedDepths = new Map();
    this._memoizedGrid = new Array(25).fill(0).map(x => new Array(25));
    this._memoizedRows = 0;
    this._memoizedCols = 0;
  }
}
