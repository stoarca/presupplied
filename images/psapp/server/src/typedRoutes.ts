import { Request, Response, NextFunction, Router } from 'express';
import { EndpointKeys, Endpoints } from '../../common/apitypes';

type RouteHandler<K extends EndpointKeys, M extends keyof Endpoints[K]> = (
  req: Request<
    Endpoints[K][M] extends { Params: any } ? Endpoints[K][M]['Params'] : never,
    Endpoints[K][M] extends { Response: any } ? Endpoints[K][M]['Response'] : never,
    Endpoints[K][M] extends { Body: any } ? Endpoints[K][M]['Body'] : never,
    Endpoints[K][M] extends { Query: any } ? Endpoints[K][M]['Query'] : never
  >,
  resp: Response<Endpoints[K][M] extends { Response: any } ? Endpoints[K][M]['Response'] : never>,
  next: NextFunction
) => void;

export function typedGet<K extends {
  [P in keyof Endpoints]: 'get' extends keyof Endpoints[P] ? P : never
}[keyof Endpoints]>(
  router: Router,
  endpointKey: K,
  handler: RouteHandler<K, 'get'>
) {
  router.get(endpointKey, handler);
}

export function typedPost<K extends {
  [P in keyof Endpoints]: 'post' extends keyof Endpoints[P] ? P : never
}[keyof Endpoints]>(
  router: Router,
  endpointKey: K,
  handler: RouteHandler<K, 'post'>
) {
  router.post(endpointKey, handler);
}

export function typedPut<K extends {
  [P in keyof Endpoints]: 'put' extends keyof Endpoints[P] ? P : never
}[keyof Endpoints]>(
  router: Router,
  endpointKey: K,
  handler: RouteHandler<K, 'put'>
) {
  router.put(endpointKey, handler);
}

export function typedDelete<K extends {
  [P in keyof Endpoints]: 'delete' extends keyof Endpoints[P] ? P : never
}[keyof Endpoints]>(
  router: Router,
  endpointKey: K,
  handler: RouteHandler<K, 'delete'>
) {
  router.delete(endpointKey, handler);
}
