FROM phusion/baseimage:jammy-1.0.1

RUN apt-get update && apt-get install -yq ca-certificates curl gnupg python3-venv libsndfile1-dev espeak espeak-ng
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq nodejs

RUN mkdir -p ~/.local/share && \
    ln -s /presupplied/tts_server/models ~/.local/share/tts

COPY ./client.runit /etc/service/client/run
RUN chmod 755 /etc/service/client/run

COPY ./server.runit /etc/service/server/run
RUN chmod 755 /etc/service/server/run

COPY ./tts_server.runit /etc/service/tts_server/run
RUN chmod 755 /etc/service/tts_server/run

CMD /sbin/my_init

