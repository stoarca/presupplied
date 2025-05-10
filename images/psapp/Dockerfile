FROM phusion/baseimage:jammy-1.0.1

RUN apt-get update && apt-get install -yq ca-certificates curl gnupg unzip
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Fix for Git dependencies in Bun
ENV GIT_DISCOVERY_ACROSS_FILESYSTEM=1

COPY ./client/package.json ./client/bun.lock /presupplied/images/psapp/client/
RUN cd /presupplied/images/psapp/client && bun install --frozen-lockfile

COPY ./server/package.json ./server/bun.lock /presupplied/images/psapp/server/
RUN cd /presupplied/images/psapp/server && bun install --frozen-lockfile

COPY . /presupplied/images/psapp
RUN cd /presupplied/images/psapp/client/ && bun run build

COPY ./client_bun_install.sh /etc/my_init.d/50_client_bun_install.sh
RUN chmod 755 /etc/my_init.d/50_client_bun_install.sh

COPY ./server_bun_install.sh /etc/my_init.d/51_server_bun_install.sh
RUN chmod 755 /etc/my_init.d/51_server_bun_install.sh

COPY ./client.runit /etc/service/client/run
RUN chmod 755 /etc/service/client/run

COPY ./server.runit /etc/service/server/run
RUN chmod 755 /etc/service/server/run

CMD /sbin/my_init

