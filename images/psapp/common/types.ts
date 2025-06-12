import _KNOWLEDGE_MAP from '../static/knowledge-map.json';
import _VIDEOS from '../static/videos.json';

// Test modules to add in test mode only
const TEST_MODULES = [
  {
    id: 'PS_TESTING_ADULT',
    deps: [],
    title: '',
    description: 'Test module for adult users',
    studentVideos: [],
    teacherVideos: [],
    cell: { i: 0, j: 0 },
    moduleType: 'ADULT_OWNED'
  },
  {
    id: 'PS_TESTING_CHILD',
    deps: [],
    title: '', 
    description: 'Test module for child users',
    studentVideos: ['PS_TESTING_STUDENT_VIDEO'],
    teacherVideos: ['PS_TESTING_TEACHER_VIDEO'],
    cell: { i: 1, j: 0 },
    moduleType: 'CHILD_OWNED'
  },
  {
    id: 'PS_TESTING_DELEGATED',
    deps: [],
    title: '',
    description: 'Test module for delegated completion',
    studentVideos: [],
    teacherVideos: [],
    cell: { i: 2, j: 0 },
    moduleType: 'CHILD_DELEGATED'
  }
];

// Dynamically create knowledge map based on environment
function createKnowledgeMap() {
  // Include test modules in non-production environments
  const isLocalDev = process.env.NODE_ENV !== 'production';
  if (isLocalDev) {
    return {
      ..._KNOWLEDGE_MAP,
      nodes: [..._KNOWLEDGE_MAP.nodes, ...TEST_MODULES]
    };
  }
  return _KNOWLEDGE_MAP;
}

// Convert videos list to dictionary for easy lookup
const VIDEOS_DICT = _VIDEOS.reduce((acc, video) => {
  acc[video.id] = video;
  return acc;
}, {} as Record<string, VideoInfo>);

export const VIDEOS = VIDEOS_DICT;

export function getVideoById(videoId: VideoId): VideoInfo {
  return VIDEOS[videoId];
}

export function getVideosByIds(videoIds: VideoId[]): VideoInfo[] {
  return videoIds.map(id => getVideoById(id));
}

// HACK: we keep this here even though GraphJson is defined later in the file
// because when we need to do a migration on this file, it should happen
// up here
export let KNOWLEDGE_MAP = createKnowledgeMap() as GraphJson;

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export enum UserType {
  PARENT = 'parent',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
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

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum ModuleType {
  ADULT_OWNED = 'ADULT_OWNED',
  CHILD_DELEGATED = 'CHILD_DELEGATED',
  CHILD_OWNED = 'CHILD_OWNED'
}

type KMType = typeof _KNOWLEDGE_MAP;
export type KMId = KMType['nodes'][number]['id'];

export interface UserProgressDTOEntry {
  status: ProgressStatus,
  completedById?: number,
  events: {
    time: number,
    status: ProgressStatus,
    completedById?: number,
  }[],
}
export interface UserProgressDTO {
  [K: KMId]: UserProgressDTOEntry
}

export interface VideoProgressEntryDTO {
  status: ProgressVideoStatus;
  updatedAt: string;
}

export interface VideoProgressDTO {
  [videoId: VideoId]: VideoProgressEntryDTO;
}



export interface ProfilePicture {
  image: string;
  background: string;
}

export interface ChildInfo {
  id: number;
  name: string;
  profilePicture: ProfilePicture;
  pinRequired: boolean;
  relationshipType: RelationshipType;
  birthday?: string | null;
  gender?: Gender | null;
}

export interface ChildInfoWithProgress extends ChildInfo {
  progress: UserProgressDTO;
}

export interface AdultInfo {
  id: number;
  name: string;
  email: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  relationshipType: RelationshipType;
  loggedIn?: boolean;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  pinRequired: boolean;
  progress: UserProgressDTO;
  videoProgress: VideoProgressDTO;
  children?: ChildInfoWithProgress[];
  adults?: AdultInfo[];
  classmates?: ChildInfo[];
  pendingInvites: InvitationDTO[];
  birthday?: string | null;
  gender?: Gender | null;
}

export interface VideoInfo {
  id: string,
  title: string,
  url: string,
}

type VideoType = typeof _VIDEOS;
export type VideoId = VideoType[number]['id'];

export interface GraphNodeInfo {
  id: string,
  title: string,
  description: string,
  studentVideos: VideoId[],
  teacherVideos: VideoId[],
  moduleType: ModuleType,
}
export interface GraphNode extends GraphNodeInfo {
  cell: {
    i: number,
    j: number,
  },
  deps: string[],
}

export interface GraphJson {
  nodes: GraphNode[],
}

export interface UserRelationshipDTO {
  adult: UserDTO;
  child: UserDTO;
  type: RelationshipType;
}

export interface InvitationDTO {
  id: number;
  inviterUser: {
    id: number;
    name: string;
    email: string;
    type: UserType;
  };
  childUser: {
    id: number;
    name: string;
    profilePicture?: ProfilePicture;
  };
  inviteeEmail: string;
  relationshipType: RelationshipType;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt?: Date;
  token: string;
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
