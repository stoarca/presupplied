FROM phusion/baseimage:jammy-1.0.1

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -yq nodejs
RUN apt-get install -yq python3-venv
RUN apt-get install -yq libsndfile1-dev
RUN apt-get install -yq espeak espeak-ng

RUN mkdir -p ~/.local/share && \
    ln -s /presupplied/tts_server/models ~/.local/share/tts

COPY ./client.runit /etc/service/client/run
RUN chmod 755 /etc/service/client/run

COPY ./server.runit /etc/service/server/run
RUN chmod 755 /etc/service/server/run

COPY ./tts_server.runit /etc/service/tts_server/run
RUN chmod 755 /etc/service/tts_server/run

CMD /sbin/my_init

