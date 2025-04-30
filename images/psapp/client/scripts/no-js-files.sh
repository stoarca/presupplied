#!/bin/bash

# This script ensures no .js or .jsx files are present in the project source code.
# It fails with a clear error message if any are found.

# Search for .js and .jsx files in the src directory
JS_FILES=$(find ./src -type f \( -name "*.js" -o -name "*.jsx" \) | grep -v "node_modules")

# Check if any files were found
if [ -n "$JS_FILES" ]; then
  echo -e "\033[31mERROR: JavaScript files detected. Only TypeScript (.ts/.tsx) files are allowed in this project!\033[0m"
  echo -e "\033[33mThe following files need to be converted to TypeScript:\033[0m"
  echo "$JS_FILES" | while read -r file; do
    echo "  - $file"
  done
  exit 1
else
  echo -e "\033[32mNo JavaScript files found. All good!\033[0m"
  exit 0
fi