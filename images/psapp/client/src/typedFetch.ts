import { EndpointKeys, Endpoints } from '../../common/apitypes';

type Params<K extends EndpointKeys> = Endpoints[K]['Params'] extends never ?
    { params?: undefined } :
    { params: Endpoints[K]['Params'] };
type Query<K extends EndpointKeys> = Endpoints[K]['Query'] extends never ?
    { query?: undefined } :
    { query: Endpoints[K]['Query'] }
type Body<K extends EndpointKeys> = Endpoints[K]['Body'] extends never ?
    { body?: undefined } :
    { body: Endpoints[K]['Body'] }

type TypedFetchRequest<K extends EndpointKeys> = {
  endpoint: K,
  method: Endpoints[K]['method'],
} & Params<K> & Query<K> & Body<K>;

export let typedFetch = async <K extends EndpointKeys>(
  request: TypedFetchRequest<K>
): Promise<Endpoints[K]['Response']> => {
  // HACK: it seems like type narrowing does not work with conditional types
  // in typescript. It's not clear to me if this function is actually being
  // typechecked or not. And it's not possible to call other functions
  // using the same conditional types as above.
  let url: string = request.endpoint;
  if ('params' in request && request.params) {
    let p = request.params;
    for (let k in request.params) {
      // TODO: not sure why I need to force "as string' here, but it doesn't
      // work without it.
      url = url.replace(':' + k, p[k] as string);
    }
  }
  if (request.query) {
    url += '?' + new URLSearchParams(request.query).toString();
  }
  let response = await fetch(url, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: request.method === 'post' ? JSON.stringify(request.body) : undefined,
  });
  return response.json() as Promise<Endpoints[K]['Response']>;
};

