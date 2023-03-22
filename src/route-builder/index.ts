import { FastifyInstance } from 'fastify';
import { Routes } from '../types.js';
import { buildRoutes } from './route-builder.js';

export function registerDefinitions(
  fastify: FastifyInstance,
  definitions: Routes,
) {
  const routes = buildRoutes(definitions);

  for (const route of routes) {
    fastify.route(route);
  }
}
