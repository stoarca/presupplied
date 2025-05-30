import { EndpointKeys, Endpoints } from '../../common/apitypes';

export const API_HOST = ''; // Global shared constant for API host

type Params<K extends EndpointKeys, M extends keyof Endpoints[K]> =
    Endpoints[K][M] extends { Params: any } ?
      Endpoints[K][M]['Params'] extends never ?
        { params?: undefined } :
        { params: Endpoints[K][M]['Params'] } :
      never;
type Query<K extends EndpointKeys, M extends keyof Endpoints[K]> =
    Endpoints[K][M] extends { Query: any } ?
      Endpoints[K][M]['Query'] extends never ?
        { query?: undefined } :
        { query: Endpoints[K][M]['Query'] } :
      never;
type Body<K extends EndpointKeys, M extends keyof Endpoints[K]> =
    Endpoints[K][M] extends { Body: any } ?
      Endpoints[K][M]['Body'] extends never ?
        { body?: undefined } :
        { body: Endpoints[K][M]['Body'] } :
      never;
type Response<K extends EndpointKeys, M extends keyof Endpoints[K]> =
    Endpoints[K][M] extends { Response: any } ?
      Endpoints[K][M]['Response'] extends never ?
        never :
        Endpoints[K][M]['Response'] :
      never;

type TypedFetchRequest<K extends EndpointKeys, M extends keyof Endpoints[K]> = {
  host: string,
  endpoint: K,
  method: M,
  headers?: Record<string, string>,
} & Params<K, M> & Query<K, M> & Body<K, M>;

let buildUrl = (
  host: string,
  endpoint: string,
  params: Record<string, unknown> | undefined,
  query: Record<string, unknown> | undefined
): string => {
  let url = endpoint;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }

  if (query && Object.keys(query).length > 0) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      qs.append(key, String(value));
    }
    url += `?${qs.toString()}`;
  }

  return host + url;
};

export async function typedFetch<K extends keyof Endpoints, M extends keyof Endpoints[K]>(
  request: TypedFetchRequest<K, M>
): Promise<Response<K, M>> {
  const url = buildUrl(
    request.host, request.endpoint, request.params, request.query
  );
  const response = await fetch(url, {
    method: String(request.method),
    headers: { 'Content-Type': 'application/json', ...request.headers },
    body: request.body ? JSON.stringify(request.body) : undefined,
  });

  return response.json() as Promise<Response<K, M>>;
}
