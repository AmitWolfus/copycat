export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export function isHttpMethod(str: string): str is HttpMethod {
  return HTTP_METHODS.includes(str as HttpMethod);
}

export type RouteString = `/${string}`;

export type RouteDefinition = {
  [K in HttpMethod]?: Handler | Handler[];
} & {
  [InnerRoute in RouteString]?: RouteDefinition;
};

export interface RequestContext {
  body: any;
  headers: Record<string, string>;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface Handler {
  body: any;
  headers: Record<string, string>;
  status: number;
  condition?: (ctx: RequestContext) => boolean;
}

export type Routes = Record<string, RouteDefinition>;
