#!/bin/bash

set -eu -o pipefail

cd /presupplied/images/pstts
source venv/bin/activate
tts-server --model_name "tts_models/en/ljspeech/vits--neon"
