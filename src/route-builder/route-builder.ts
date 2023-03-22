import {
  HttpMethod,
  HTTP_METHODS,
  isHttpMethod,
  RouteDefinition,
  Routes,
} from '../types.js';
import { buildHandler, RouteHandler } from './handler.js';

export function buildRoutes(routeObject: Routes) {
  return Object.entries(routeObject).flatMap(([prefix, definitions]) =>
    buildRoutesInternal(prefix, definitions),
  );
}

function buildRoutesInternal(prefix: string, definitions: RouteDefinition) {
  let routes: RouteHandler[] = [];

  for (const [key, definition] of Object.entries(definitions)) {
    if (isHttpMethod(key)) {
      routes.push(buildHandler(prefix, key, definition));
    } else {
      routes = routes.concat(
        buildRoutesInternal(`${prefix}${key}`, definition as RouteDefinition),
      );
    }
  }
  return routes;
}
