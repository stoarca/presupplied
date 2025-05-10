#!/bin/bash

set -eu -o pipefail

docker compose -f <(bun docker-compose.yml.js dev) --project-directory ./ up --build
