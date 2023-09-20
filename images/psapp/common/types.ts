import _KNOWLEDGE_MAP from '../static/knowledge-map.json';

export enum ProgressStatus {
  NOT_ATTEMPTED = 'not_attempted',
  ATTEMPTED = 'attempted',
  PASSED = 'passed',
}

type KMType = typeof _KNOWLEDGE_MAP;
type KMIds = KMType['nodes'][number]['id'];

export interface StudentProgressDTO {
  moduleVanityId: KMIds;
  status: ProgressStatus;
}

export interface StudentDTO {
  name: string;
  email: string;
  progress: StudentProgressDTO[];
}

export interface GraphNode {
  id: string,
  deps: string[],
  i: number,
  j: number,
}

export interface GraphJson {
  nodes: GraphNode[],
}

