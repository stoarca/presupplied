#!/usr/bin/env node

/**
 * This script ensures no .js or .jsx files are present in the project.
 * It fails with a clear error message if any are found.
 */

const glob = require('glob');

// Look for .js and .jsx files in the src directory
const jsFiles = glob.sync('src/**/*.{js,jsx}', {
  ignore: 'node_modules/**'
});

if (jsFiles.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: JavaScript files detected. Only TypeScript (.ts/.tsx) files are allowed in this project!');
  console.error('\x1b[33m%s\x1b[0m', 'The following files need to be converted to TypeScript:');
  jsFiles.forEach(file => {
    console.error(`  - ${file}`);
  });
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', 'No JavaScript files found. All good!');