import { writeFileSync, mkdirSync, readdirSync, existsSync, watch, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

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

generateModulesList();

const outdir = '../static/dist';
console.log(`Output directory will be: ${outdir} (resolved to: ${join(import.meta.dir, outdir)})`);

const config = {
  entrypoints: ['./src/index.tsx'],
  outdir: outdir,
  target: 'browser',
  naming: '[name].[ext]',
  sourcemap: 'external',
  minify: process.env.NODE_ENV === 'production',
  plugins: [],
  loaders: {
    '.svg': 'file',
    '.wav': 'file',
    '.css': 'css',
    '.scss': 'css',
    '.sass': 'css',
  }
};

async function build() {
  const startTime = performance.now();
  const result = await Bun.build(config);
  const endTime = performance.now();
  console.log(`Build completed in ${Math.round(endTime - startTime)}ms with ${result.outputs.length} output files`);
  return result;
}

const isWatchMode = process.argv.includes('--watch');

(async () => {
  await build();

  if (isWatchMode) {
    console.log('Watching src/ directory for changes...');
    let debounceTimer = null;
    let isBuilding = false;
    const fileContents = new Map();

    watch('./src', { recursive: true }, (event, filename) => {
      if (!filename) { return; }

      const fullPath = join('./src', filename);

      if (!existsSync(fullPath)) {
        console.log(`File deleted: ${filename}`);
        if (debounceTimer) { clearTimeout(debounceTimer); }
        fileContents.delete(fullPath);

        debounceTimer = setTimeout(async () => {
          if (isBuilding) { return; }
          isBuilding = true;
          await build();
          generateModulesList();
          isBuilding = false;
        }, 100);
        return;
      }

      try {
        const currentContent = readFileSync(fullPath, 'utf-8');
        const previousContent = fileContents.get(fullPath);

        if (previousContent !== currentContent) {
          console.log(`File changed: ${filename}`);
          if (debounceTimer) { clearTimeout(debounceTimer); }
          fileContents.set(fullPath, currentContent);

          debounceTimer = setTimeout(async () => {
            if (isBuilding) { return; }
            isBuilding = true;
            await build();
            generateModulesList();
            isBuilding = false;
          }, 100);
        }
      } catch {
        console.log(`File changed (binary): ${filename}`);
        if (debounceTimer) { clearTimeout(debounceTimer); }

        debounceTimer = setTimeout(async () => {
          if (isBuilding) { return; }
          isBuilding = true;
          await build();
          generateModulesList();
          isBuilding = false;
        }, 100);
      }
    });
  }
})();

export default config;
