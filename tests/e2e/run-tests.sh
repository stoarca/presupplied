#!/bin/bash
set -eu -o pipefail

# Function to kill background processes on exit
cleanup() {
  echo "Cleaning up processes..."
  # Kill Xvfb and fluxbox
  pkill Xvfb || true
  pkill fluxbox || true
}

# Set up signal handler for Ctrl+C and other termination signals
trap cleanup EXIT INT TERM

sudo update-ca-certificates

# Start Xvfb
Xvfb :50 -screen 0 2560x1600x24 2>/dev/null &
XVFB_PID=$!

# Start fluxbox
fluxbox 2>/dev/null &
FLUXBOX_PID=$!

# Run the tests
cd /app && /home/seluser/.bun/bin/bun run test --timeout 120000 "$@"
TEST_EXIT_CODE=$?

exit $TEST_EXIT_CODE
