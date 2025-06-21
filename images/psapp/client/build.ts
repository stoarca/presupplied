import { writeFileSync, mkdirSync, readdirSync, existsSync, watch } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { context } from 'esbuild';

const modulesDir = join(import.meta.dir, 'src/modules');

const getModuleNames = () => {
  const files = readdirSync(modulesDir);
  return files
      .map(f => basename(f))
      .filter(f => f !== 'common');
};

const generateModulesList = () => {
  const autogenPath = join(import.meta.dir, 'src/autogen');
  if (!existsSync(autogenPath)) {
    mkdirSync(autogenPath, { recursive: true });
  }

  const moduleNames = getModuleNames();
  const json = JSON.stringify(moduleNames);
  writeFileSync(
    join(autogenPath, 'available-modules.json'),
    json
  );
  console.log(`Writing ${moduleNames.length} modules to autogen/available-modules.json`);
  return moduleNames;
};

const getEntryPoints = () => {
  const entryPoints = ['src/index.tsx'];
  getModuleNames().forEach(moduleName => {
    entryPoints.push(`src/modules/${moduleName}/index.tsx`);
  });
  return entryPoints;
};

const moduleListPlugin = {
  name: 'module-list-generator',
  setup(build) {
    build.onStart(() => {
      console.log('Regenerating module list...');
      generateModulesList();
    });
  }
};

const outdir = resolve(import.meta.dir, '../static/dist');
console.log(`Output directory will be: ${outdir}`);

const isWatchMode = process.argv.includes('--watch');

const getBuildOptions = () => ({
  entryPoints: getEntryPoints(),
  bundle: true,
  outdir,
  format: 'esm',
  target: 'es2020',
  platform: 'browser',
  splitting: true,
  sourcemap: false,
  minify: process.env.NODE_ENV === 'production',
  metafile: true,
  loader: {
    '.svg': 'file',
    '.wav': 'file',
    '.css': 'css',
    '.scss': 'css',
    '.sass': 'css',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
  },
  publicPath: '/static/dist',
  chunkNames: 'chunks/[name]-[hash]',
  assetNames: 'assets/[name]-[hash]',
  outExtension: { '.js': '.js' },
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
      ? '"production"'
      : '"development"'
  },
  plugins: [moduleListPlugin]
});

async function run() {
  try {
    let ctx = await context(getBuildOptions());
    let currentModules = new Set(getModuleNames());

    if (isWatchMode) {
      await ctx.watch();
      console.log('Watching for changes...');

      const modulesWatcher = watch(modulesDir, { recursive: false }, async (eventType, filename) => {
        if (eventType === 'rename' && filename) {
          const newModules = new Set(getModuleNames());
          const modulesChanged = currentModules.size !== newModules.size ||
            [...currentModules].some(mod => !newModules.has(mod)) ||
            [...newModules].some(mod => !currentModules.has(mod));

          if (modulesChanged) {
            console.log(`Module directory changed: ${filename}`);
            console.log('Detected new/removed modules, rebuilding...');

            await ctx.dispose();
            currentModules = newModules;
            ctx = await context(getBuildOptions());
            await ctx.watch();
            console.log('Rebuild completed, watching for changes...');
          }
        }
      });

      process.stdin.on('end', async () => {
        modulesWatcher.close();
        await ctx.dispose();
        process.exit(0);
      });

      process.on('SIGINT', async () => {
        console.log('Closing build context...');
        modulesWatcher.close();
        await ctx.dispose();
        process.exit(0);
      });
    } else {
      const startTime = performance.now();
      const result = await ctx.rebuild();
      const endTime = performance.now();

      console.log(`Build completed in ${Math.round(endTime - startTime)}ms`);

      if (result.metafile) {
        const outputs = Object.keys(result.metafile.outputs).length;
        console.log(`Generated ${outputs} output files`);
      }

      await ctx.dispose();
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

run();

export default {};
