#!/bin/bash
set -eu -o pipefail

# Navigate to the script directory
cd "$(dirname "$0")"

# Variable to store container ID
CONTAINER_ID=""

# Function to handle cleanup
cleanup() {
    echo "Stopping tests..."
    if [ -n "$CONTAINER_ID" ]; then
        echo "Stopping container $CONTAINER_ID..."
        docker kill $CONTAINER_ID >/dev/null 2>&1 || true
    fi
    exit 0
}

# Set up signal handler for Ctrl+C and other termination signals
trap cleanup INT TERM

# Install dependencies locally with frozen lockfile
echo "Installing dependencies locally..."
bun install --frozen-lockfile

# Build the Docker image
echo "Building E2E test image..."
docker build -t presupplied-e2e-tests .

# Get host IP for applocal.presupplied.com
echo "Setting up network for container..."
HOST_IP=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
if [ -z "$HOST_IP" ]; then
    # Fallback to default gateway if docker0 is not found
    HOST_IP=$(ip route | grep default | awk '{print $3}')
fi

# Find the certificate
CERT_PATH="/usr/local/share/ca-certificates/presupplied-selfsigned.crt"
if [ ! -f "$CERT_PATH" ]; then
  REPO_ROOT="$(realpath $(dirname "$0")/../..)"
  CERT_PATH="$REPO_ROOT/images/psingress/certs/presupplied-selfsigned.crt"
  if [ ! -f "$CERT_PATH" ]; then
    echo "Error: Certificate not found. Please run setup steps from CLAUDE.md."
    exit 1
  fi
fi

# Run the Docker container with the E2E tests
echo "Running E2E tests..."
CONTAINER_ID=$(docker run --rm -d \
  --shm-size=2g \
  -v "$(realpath $(dirname "$0")/../..):/presupplied" \
  -v "$(pwd):/app" \
  -v "$CERT_PATH:/usr/local/share/ca-certificates/presupplied-selfsigned.crt" \
  -p 5900:5900 \
  --add-host=applocal.presupplied.com:$HOST_IP \
  presupplied-e2e-tests bash -c "/app/run-tests.sh $(printf '%q ' "$@")")

# Follow the logs until the container exits
docker logs -f $CONTAINER_ID
EXIT_CODE=$(docker wait $CONTAINER_ID)
exit $EXIT_CODE
