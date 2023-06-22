import Fastify from 'fastify';
import {
  Assertions,
  AssertionsManager,
} from './assertions/assertions-manager.js';
import { registerAssertions } from './assertions/index.js';
import { registerDefinitions } from './route-builder/index.js';
import { Routes } from './types.js';

export type Url = `http://${string}`;

export interface MockServer {
  listen(): Promise<Url>;
  close(): Promise<void>;
  assert: Assertions;
}

interface RequiredServerOptions {
  port: number;
  enableAssertions: boolean;
}

export type ServerOptions = Partial<RequiredServerOptions>;

const DEFAULT_OPTIONS: RequiredServerOptions = {
  port: 3000,
  enableAssertions: false,
};

export function mockServer(
  routeDefinitions: Routes,
  opts: ServerOptions = {},
): MockServer {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };
  const fastify = Fastify({ logger: true });
  registerDefinitions(fastify, routeDefinitions);
  const assertions = new AssertionsManager();

  if (opts.enableAssertions) {
    registerAssertions(fastify, assertions);
  }

  return {
    async listen() {
      const url = (await fastify.listen({
        port: options.port,
        host: '0.0.0.0',
      })) as Url;

      return url;
    },
    async close() {
      await fastify.close();
    },
    assert: assertions,
  };
}
