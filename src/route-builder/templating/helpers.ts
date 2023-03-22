import Handlebars from 'handlebars';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';

export function randomNumberId(length: number) {
  const part = new Array(length);
  for (let i = 0; i < length; i++) {
    part[i] = Math.floor(Math.random() * 10);
  }

  return part.join('');
}

export function fakerHelper(fnName: string, ...args: any[]) {
  let fn: Record<string, any> = faker;
  for (const name of fnName.split('.')) {
    fn = fn[name];
    if (!fn) {
      throw new Error(`Unknown faker function ${fnName}`);
    }
  }
  if (typeof fn !== 'function') {
    throw new Error(`Faker property ${fnName} is not a function`);
  }
  return fn(...args);
}

export function registerHelpers(handlebars: typeof Handlebars) {
  handlebars.registerHelper('randomNumberId', randomNumberId);
  handlebars.registerHelper('nanoid', (size: number) => {
    if (typeof size === 'number') {
      return nanoid(size);
    }
    return nanoid();
  });
  handlebars.registerHelper('faker', fakerHelper);
}
