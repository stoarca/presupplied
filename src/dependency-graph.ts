import {DepGraph as _DepGraph} from 'dependency-graph';

export class DepGraph<T> extends _DepGraph<T> {
  _memoizedDepths: Map<string, number>;

  constructor() {
    super();
    this._memoizedDepths = new Map();
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
}
