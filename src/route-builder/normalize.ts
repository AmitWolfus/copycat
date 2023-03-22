import { Handler, RequestContext } from '../types.js';
import { compileCondition } from './conditions.js';
import { createParser } from './templating/index.js';

const DEFAULT_DEFINITION = {
  headers: {
    'content-type': 'application/json',
  },
  status: 200,
};

export interface NormalizedHandler {
  headers(ctx: RequestContext): Record<string, string>;
  body(ctx: RequestContext): any;
  status: number;
  condition?: (ctx: RequestContext) => boolean;
}

export function normalizeDefinition(definition: any): NormalizedHandler[] {
  if (!Array.isArray(definition)) {
    definition = [definition];
  }

  return definition.map((item: any) => {
    if (!item.body) {
      item = {
        body: item,
      };
    }
    const normalized = {
      ...DEFAULT_DEFINITION,
      ...item,
    };
    if (normalized.condition && typeof normalized.condition === 'string') {
      normalized.condition = compileCondition(normalized.condition);
    }
    normalized.body = createParser(normalized.body);
    normalized.headers = createParser(normalized.headers);
    return normalized;
  });
}
