#!/bin/bash

set -eu -o pipefail

docker build --tag presupplied:latest .
docker rm -f presupplied || true
docker run -it -d -p 9500:8080 --restart=always --name=presupplied --mount="type=bind,src=$(realpath $(pwd)/..)/,dst=/presupplied" presupplied:latest
docker logs presupplied -f
