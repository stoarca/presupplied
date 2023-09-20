#!/bin/bash

set -eu -o pipefail

cd /presupplied/images/psapp/server
if [ "$NODE_ENV" == "development" ]; then
  npm ci
fi
