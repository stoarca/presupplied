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

export enum ProgressVideoStatus {
  NOT_WATCHED = 'not_watched',
  WATCHED = 'watched',
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

export interface StudentProgressVideoDTO {
  [K: KMId]: Record<string, ProgressVideoStatus>
}

export interface StudentDTO {
  name: string;
  email: string;
  progress: StudentProgressDTO;
}

export interface VideoInfo {
  id: string, // This id only has to be unique within a module
  title: string,
  url: string,
}

export interface GraphNodeInfo {
  id: string,
  title: string,
  description: string,
  studentVideos: VideoInfo[],
  teacherVideos: VideoInfo[],
  forTeachers?: boolean,
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

interface MicrophoneStartTrainingEvent {
  status: 'microphoneStart',
}
interface ModuleTrainingEvent {
  kmid: string,
  exerciseData: any,
  status: 'start' | 'success' | 'fail'
}
export type InputTrainingEvent =
    MicrophoneStartTrainingEvent | ModuleTrainingEvent;
export type TrainingEvent = InputTrainingEvent & {
  time: Date,
};

