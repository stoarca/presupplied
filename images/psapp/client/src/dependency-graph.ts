import {DepGraph} from 'dependency-graph';

import { GraphNode, GraphJson, UserType, ModuleType } from '../../common/types';

export class TechTree extends DepGraph<GraphNode> {
  _memoizedDepths!: Map<string, number>;
  _memoizedGrid!: string[][];
  _memoizedRows!: number;
  _memoizedCols!: number;
  _cachedModulesByType!: Map<ModuleType, Set<string>>;

  getModulesByType(moduleType: ModuleType): Set<string> {
    if (this._cachedModulesByType.get(ModuleType.ADULT_OWNED)!.size === 0 &&
        this._cachedModulesByType.get(ModuleType.CHILD_DELEGATED)!.size === 0 &&
        this._cachedModulesByType.get(ModuleType.CHILD_OWNED)!.size === 0) {
      this.overallOrder().forEach(kmid => {
        const node = this.getNodeData(kmid);
        const typeSet = this._cachedModulesByType.get(node.moduleType);
        if (!typeSet) {
          throw new Error(`Unknown module type: ${node.moduleType}`);
        }
        typeSet.add(kmid);
      });
    }
    return this._cachedModulesByType.get(moduleType)!;
  }

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
  getReachables(
    userType: UserType | 'hybrid',
    reached: Set<string>,
    childrenReachedSets?: Map<number, Set<string>>
  ): { reachable: Set<string>, childrenReachableSets: Map<number, Set<string>> } {
    const childrenReachableSets = new Map<number, Set<string>>();

    if (userType === 'hybrid') {
      // For hybrid users (anonymous or self-registered students), show all reachable modules regardless of type
      const reachable = this.getBasicReachable(reached);
      return { reachable, childrenReachableSets };
    }

    if (userType === UserType.STUDENT) {
      const studentReached = new Set(reached);
      const adultOwnedModules = this.getModulesByType(ModuleType.ADULT_OWNED);
      adultOwnedModules.forEach(kmid => studentReached.add(kmid));

      const studentReachable = this.getBasicReachable(studentReached);
      const filteredReachable = new Set<string>();
      studentReachable.forEach(kmid => {
        const node = this.getNodeData(kmid);
        if (node.moduleType === ModuleType.CHILD_OWNED) {
          filteredReachable.add(kmid);
        }
      });

      return { reachable: filteredReachable, childrenReachableSets };
    }


    const parentReachable = this.getBasicReachable(reached);
    const filteredParentReachable = new Set<string>();

    parentReachable.forEach(kmid => {
      const node = this.getNodeData(kmid);
      if (node.moduleType === ModuleType.ADULT_OWNED) {
        filteredParentReachable.add(kmid);
      }
    });

    if (childrenReachedSets) {
      const adultOwnedModules = this.getModulesByType(ModuleType.ADULT_OWNED);

      const checkAllAdultDepsReached = (kmid: string): boolean => {
        const deps = this.dependenciesOf(kmid);
        for (const dep of deps) {
          const depNode = this.getNodeData(dep);
          if (depNode.moduleType === ModuleType.ADULT_OWNED && !reached.has(dep)) {
            return false;
          }
        }
        return true;
      };

      childrenReachedSets.forEach((childReached, childId) => {
        const childReachedWithAdult = new Set(childReached);
        adultOwnedModules.forEach(kmid => childReachedWithAdult.add(kmid));

        const childReachable = this.getBasicReachable(childReachedWithAdult);

        const filteredChildReachable = new Set<string>();
        childReachable.forEach(kmid => {
          const node = this.getNodeData(kmid);
          if (node.moduleType !== ModuleType.ADULT_OWNED) {
            filteredChildReachable.add(kmid);
          }

          if (node.moduleType === ModuleType.CHILD_DELEGATED && checkAllAdultDepsReached(kmid)) {
            filteredParentReachable.add(kmid);
          }
        });
        childrenReachableSets.set(childId, filteredChildReachable);
      });
    }

    return { reachable: filteredParentReachable, childrenReachableSets };
  }

  getBasicReachable(reached: Set<string>): Set<string> {
    let reachable = new Set<string>();
    let leaves = this.overallOrder(true);
    leaves.forEach(x => {
      if (!reached.has(x)) {
        reachable.add(x);
      }
    });
    reached.forEach(x => {
      this.directDependentsOf(x).forEach(y => {
        if (
          !reached.has(y) &&
              this.directDependenciesOf(y).every(z => reached.has(z))
        ) {
          reachable.add(y);
        }
      });
    });
    return reachable;
  }
  clearMemo() {
    // TODO: this can be automatically calculated so that users don't have to
    this._memoizedDepths = new Map();
    this._memoizedGrid = new Array(200).fill(0).map(x => new Array(120));
    this._memoizedRows = 0;
    this._memoizedCols = 0;
    this._cachedModulesByType = new Map([
      [ModuleType.ADULT_OWNED, new Set()],
      [ModuleType.CHILD_DELEGATED, new Set()],
      [ModuleType.CHILD_OWNED, new Set()]
    ]);
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

      if (node.moduleType === ModuleType.CHILD_OWNED) {
        const depNode = graph.getNodeData(node.deps[j]);
        if (depNode.moduleType === ModuleType.ADULT_OWNED) {
          throw new Error(
            `CHILD_OWNED module ${node.id} cannot directly depend on ADULT_OWNED module ${node.deps[j]}. ` +
            'There must be a CHILD_DELEGATED module in between to bridge adult and child content.'
          );
        }
      }

      graph.addDependency(node.id, node.deps[j]);
    }
  }


  return graph;
};
