import { HttpMethod } from '../types.js';
import { RequestInfo } from './assertions-manager.js';

export interface Expect {
  toHaveBeenCalled(times?: number): void;
}

export function expectUrl(
  callsLog: RequestInfo[],
  url: string,
  method: HttpMethod,
): Expect {
  const values = callsLog.filter((x) => x.method === method && x.url === url);
  return {
    toHaveBeenCalled(times = 1) {
      return values.length === times;
    },
  };
}

export function expectRoute(
  callsLog: RequestInfo[],
  route: string,
  method: HttpMethod,
): Expect {
  const values = callsLog.filter(
    (x) => x.method === method && x.route === route,
  );

  return {
    toHaveBeenCalled(times = 1) {
      return values.length === times;
    },
  };
}
