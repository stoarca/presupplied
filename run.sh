#!/bin/bash

set -eu -o pipefail

docker compose -f <(node docker-compose.yml.js dev) --project-directory ./ up --build
