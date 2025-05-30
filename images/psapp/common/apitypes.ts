import { AuthEndpoints } from './apitypes/auth';
import { UserEndpoints } from './apitypes/user';
import { ChildrenEndpoints } from './apitypes/children';
import { InvitationsEndpoints } from './apitypes/invitations';
import { LearningEndpoints } from './apitypes/learning';
import { TrainingEndpoints } from './apitypes/training';
import { TestEndpoints } from './apitypes/test';
import { TtsEndpoints } from './apitypes/tts';

export type Endpoints = 
  & AuthEndpoints
  & UserEndpoints
  & ChildrenEndpoints
  & InvitationsEndpoints
  & LearningEndpoints
  & TrainingEndpoints
  & TestEndpoints
  & TtsEndpoints;

export type EndpointKeys = keyof Endpoints;

type CheckExtends<U extends T, T> = T;
type Test = CheckExtends<Endpoints, {
  [K in EndpointKeys]: {
    get?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: never,
      Response: Record<string, any>,
    },
    post?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: Record<string, any>,
      Response: Record<string, any>,
    },
    put?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: Record<string, any>,
      Response: Record<string, any>,
    },
    delete?: {
      Params: Record<string, string>,
      Query: Record<string, string>,
      Body: never,
      Response: Record<string, any>,
    },
  }
}>;

export let verifyApiTypes: Test;