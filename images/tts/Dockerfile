FROM phusion/baseimage:jammy-1.0.1

RUN apt-get update && apt-get install -yq ca-certificates curl gnupg python3-venv libsndfile1-dev espeak espeak-ng

RUN mkdir -p ~/.local/share && \
    ln -s /tts_models ~/.local/share/tts

COPY requirements.txt /presupplied/images/tts/requirements.txt
RUN cd /presupplied/images/tts && \
    python3 -m venv ./venv && \
    ./venv/bin/pip install -r requirements.txt

COPY . /presupplied/images/tts

COPY ./tts.runit /etc/service/tts/run
RUN chmod 755 /etc/service/tts/run
