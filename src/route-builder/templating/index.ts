import Handlebars from 'handlebars';
import { RequestContext } from '../../types.js';
import { registerHelpers } from './helpers.js';

registerHelpers(Handlebars);

function compile(template: string) {
  return Handlebars.compile(template, {
    noEscape: true,
  });
}

export function createTemplateFn(content: any) {
  if (typeof content === 'string') {
    return compile(content);
  } else if (typeof content === 'object' && '$template' in content) {
    const template = compile(content.$template);
    return (ctx: RequestContext) => {
      const str = template(ctx);

      return JSON.parse(str);
    };
  }
  return () => content;
}

function isDirectValue(val: any) {
  const type = typeof val;
  return ['number', 'string', 'boolean'].includes(type) || '$template' in val;
}

type TemplateFunction = (ctx: RequestContext) => any;

export function createParser(obj: any) {
  if (typeof obj === 'string') {
    return createTemplateFn(obj);
  }

  if (Array.isArray(obj)) {
    const array: TemplateFunction[] = obj.map((x) => createParser(x));

    return (ctx: RequestContext) => {
      return array.map((fn) => fn(ctx));
    };
  }

  const builder: Record<string, TemplateFunction> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (isDirectValue(val)) {
      builder[key] = createTemplateFn(val);
    } else {
      builder[key] = createParser(val);
    }
  }

  return (ctx: RequestContext) => {
    const res: Record<string, any> = {};
    for (const [key, val] of Object.entries(builder)) {
      res[key] = val(ctx);
    }

    return res;
  };
}
