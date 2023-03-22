import { FastifyInstance } from 'fastify';
import { AssertionsManager } from './assertions-manager.js';

export function registerAssertions(
  fastify: FastifyInstance,
  assertionsManager: AssertionsManager,
) {
  fastify.addHook('onResponse', async (request) => {
    assertionsManager.logCall(request);
  });
}
