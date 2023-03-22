import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpMethod, RequestContext } from '../types.js';
import { normalizeDefinition } from './normalize.js';

export interface RouteHandler {
  method: HttpMethod;
  url: string;
  handler(request: FastifyRequest, reply: FastifyReply): Promise<any>;
}

export function buildHandler(
  url: string,
  method: HttpMethod,
  definition: any,
): RouteHandler {
  const normalized = normalizeDefinition(definition);

  return {
    method,
    url,
    async handler(request, reply) {
      for (const def of normalized) {
        const condition = def.condition || (() => true);
        const ctx = {
          body: request.body,
          headers: request.headers,
          params: request.params,
          hostname: request.hostname,
        } as unknown as RequestContext;
        if (condition(ctx)) {
          reply.status(def.status);
          reply.headers(def.headers(ctx));
          return def.body(ctx);
        }
      }

      reply.status(404);
      return {
        message: 'no handler matches condition',
      };
    },
  };
}
