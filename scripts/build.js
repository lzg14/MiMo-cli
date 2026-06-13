import * as esbuild from 'esbuild';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outfile = join(__dirname, '..', 'dist', 'mimo.js');

await esbuild.build({
  entryPoints: [join(__dirname, '..', 'src', 'main.ts')],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node18',
  outfile,
  format: 'esm',
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [],
  logLevel: 'info',
});
