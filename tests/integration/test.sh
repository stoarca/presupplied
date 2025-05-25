#!/bin/bash

set -e

cd "$(dirname "$0")/../.."

echo "Building integration test container..."
docker build -t presupplied-integration-tests -f tests/integration/Dockerfile .

echo "Running migration integration tests..."
docker run --rm -v "$(pwd):/app" presupplied-integration-tests bash -c "cd /app/images/psapp/server && bun install --frozen-lockfile && cd /app && bun test tests/integration/migrations.test.ts"

echo "Integration tests completed successfully!"