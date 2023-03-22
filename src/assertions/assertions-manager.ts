import { FastifyRequest } from 'fastify';
import { HttpMethod } from '../types.js';
import { expectUrl, expectRoute, Expect } from './expect.js';

export interface Assertions {
  clear(): void;
  expectUrl(url: string, method: HttpMethod): Expect;
  expectRoute(url: string, method: HttpMethod): Expect;
}

export interface RequestInfo {
  url: string;
  route: string;
  method: HttpMethod;
  time: Date;
  request: {
    headers: Record<string, string>;
    body: any;
    params: Record<string, string>;
  };
}

export class AssertionsManager implements Assertions {
  private requestLog: RequestInfo[];

  constructor() {
    this.requestLog = [];
  }

  clear() {
    this.requestLog = [];
  }

  expectRoute(url: string, method: HttpMethod): Expect {
    return expectRoute(this.requestLog, url, method);
  }

  expectUrl(url: string, method: HttpMethod): Expect {
    return expectUrl(this.requestLog, url, method);
  }

  logCall(request: FastifyRequest) {
    this.requestLog.push({
      url: request.url,
      route: request.routerPath,
      method: request.method as HttpMethod,
      time: new Date(),
      request: {
        headers: request.headers as Record<string, string>,
        body: request.body,
        params: request.params as Record<string, string>,
      },
    });
  }
}
