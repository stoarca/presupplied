FROM phusion/baseimage:jammy-1.0.1

RUN apt-get update && apt-get install -yq ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq nodejs

COPY ./client/package.json ./client/package-lock.json /presupplied/images/psapp/client/
RUN cd /presupplied/images/psapp/client && npm ci

COPY ./server/package.json ./server/package-lock.json /presupplied/images/psapp/server/
RUN cd /presupplied/images/psapp/server && npm ci

COPY . /presupplied/images/psapp
RUN cd /presupplied/images/psapp/client/ && npm run build

COPY ./client_npm_ci.sh /etc/my_init.d/50_client_npm_ci.sh
RUN chmod 755 /etc/my_init.d/50_client_npm_ci.sh

COPY ./server_npm_ci.sh /etc/my_init.d/51_server_npm_ci.sh
RUN chmod 755 /etc/my_init.d/51_server_npm_ci.sh

COPY ./client.runit /etc/service/client/run
RUN chmod 755 /etc/service/client/run

COPY ./server.runit /etc/service/server/run
RUN chmod 755 /etc/service/server/run

CMD /sbin/my_init

