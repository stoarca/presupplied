import _KNOWLEDGE_MAP from '../static/knowledge-map.json';
// HACK: we keep this here even though GraphJson is defined latr in the file
// because when we need to do a migration on this file, it should happen
// up here
export let KNOWLEDGE_MAP = _KNOWLEDGE_MAP as GraphJson;

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export enum UserType {
  PARENT = 'parent',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum RelationshipType {
  PRIMARY = 'primary',       // Primary caretaker - can manage child and assign others
  SECONDARY = 'secondary',   // Secondary caretaker - can manage child but not modify relationships
  OBSERVER = 'observer',     // Observer only - can view progress but not modify
}

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

export interface ProfilePicture {
  image: string;
  background: string;
}

export interface ChildInfo {
  id: number;
  name: string;
  profilePicture?: ProfilePicture;
  pinRequired?: boolean;
}

export interface ParentInfo {
  id: number;
  name: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  relationshipType: RelationshipType;
  loggedIn?: boolean;
}

export interface UserDTO extends StudentDTO {
  id: number;
  type: UserType;
  profilePicture?: ProfilePicture;
  children?: ChildInfo[];
  parents?: ParentInfo[];
  classmates?: ChildInfo[];
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
  onBehalfOfStudent?: boolean,
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

export interface UserRelationshipDTO {
  adult: UserDTO;
  child: UserDTO;
  type: RelationshipType;
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
