import { RequestContext } from '../types.js';

export type ConditionPredicate = (ctx: RequestContext) => boolean;

export function compileCondition(conditionString: string) {
  return new Function(`
    const { body, headers, params } = arguments[0];
    
    return ${conditionString};`) as ConditionPredicate;
}
