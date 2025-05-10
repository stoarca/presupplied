#!/bin/bash

set -eu -o pipefail

cd /presupplied/images/psapp/client
if [ "$NODE_ENV" == "development" ]; then
  # If lockfile exists but is invalid, remove it and run fresh install
  if [ -f bun.lock ] && ! bun install --frozen-lockfile > /dev/null 2>&1; then
    echo "Invalid lockfile detected, running fresh install"
    rm bun.lock
    bun install
  else
    bun install --frozen-lockfile || bun install
  fi
fi
