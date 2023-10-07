import _KNOWLEDGE_MAP from '../static/knowledge-map.json';

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export enum ProgressStatus {
  NOT_ATTEMPTED = 'not_attempted',
  ATTEMPTED = 'attempted',
  PASSED = 'passed',
}

type KMType = typeof _KNOWLEDGE_MAP;
export type KMId = KMType['nodes'][number]['id'];

export interface StudentProgressDTOEntry {
  status: ProgressStatus,
  events: {
    time: number,
    status: ProgressStatus,
  }[],
}
export interface StudentProgressDTO {
  [K: KMId]: StudentProgressDTOEntry
}

export interface StudentDTO {
  name: string;
  email: string;
  progress: StudentProgressDTO;
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

