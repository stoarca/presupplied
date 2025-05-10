import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

// Generate available-modules.json
const generateModulesList = () => {
  const autogenPath = join(import.meta.dir, 'src/autogen');
  if (!existsSync(autogenPath)) {
    mkdirSync(autogenPath, { recursive: true });
  }

  const modulesDir = join(import.meta.dir, 'src/modules');
  const files = readdirSync(modulesDir);
  const moduleNames = files
      .map(f => basename(f))
      .filter(f => f !== 'common');

  const json = JSON.stringify(moduleNames);
  writeFileSync(
    join(autogenPath, 'available-modules.json'),
    json
  );
  console.log(`Writing ${moduleNames.length} modules to autogen/available-modules.json`);
};

// Run the generator
generateModulesList();

// Configure Bun's bundler
export default {
  entrypoints: ['./src/index.tsx'],
  outdir: '../static/dist',
  target: 'browser',
  sourcemap: 'external',
  minify: process.env.NODE_ENV === 'production',
  plugins: [],
  loaders: {
    '.svg': 'file',
    '.wav': 'file',
    '.css': 'css',
    '.scss': 'css',
    '.sass': 'css',
  },
};
