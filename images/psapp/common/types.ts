import _KNOWLEDGE_MAP from '../static/knowledge-map.json';
// HACK: we keep this here even though GraphJson is defined latr in the file
// because when we need to do a migration on this file, it should happen
// up here
export let KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

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

export interface VideoInfo {
  title: string,
  url: string,
}

export interface GraphNodeInfo {
  id: string,
  title: string,
  description: string,
  studentVideos: VideoInfo[],
  teacherVideos: VideoInfo[],
}
export interface GraphNode extends GraphNodeInfo {
  cell: {
    i: number,
    j: number,
  },
  deps: string[],
  subNodes: GraphNodeInfo[],
}

export interface GraphJson {
  nodes: GraphNode[],
}

