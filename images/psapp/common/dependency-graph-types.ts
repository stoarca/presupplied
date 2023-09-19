export interface GraphNode {
  id: string,
  deps: string[],
  i: number,
  j: number,
}

export interface GraphJson {
  nodes: GraphNode[],
}

