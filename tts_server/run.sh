#!/bin/bash

set -eu -o pipefail
source venv/bin/activate
tts-server --model_name tts_models/en/ljspeech/vits--neon
