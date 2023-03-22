#!/usr/bin/env node

import minimist from 'minimist';
import { readFile } from 'fs/promises';
import { mockServer } from './mock-server.js';

async function getDefinitions(file: string) {
  const defs = await readFile(file);

  return JSON.parse(defs.toString('utf8'));
}

function parseArgs() {
  const argv = minimist(process.argv.slice(2));
  const file = argv.file || argv.f;
  const port = parseInt(argv.port || argv.p);

  if (!file) {
    console.error('Missing required --file parameter');
    process.exit(1);
  }

  return {
    file,
    port: Number.isNaN(port) ? 3000 : port,
  };
}

const main = async () => {
  const { file, port } = parseArgs();
  const definitions = await getDefinitions(file);
  const server = mockServer(definitions, { port });
  try {
    await server.listen();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
