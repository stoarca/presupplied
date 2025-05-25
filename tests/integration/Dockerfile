FROM phusion/baseimage:jammy-1.0.1

RUN apt-get update && apt-get install -yq ca-certificates curl gnupg unzip
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

ENV GIT_DISCOVERY_ACROSS_FILESYSTEM=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql \
    postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

USER postgres
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER testuser WITH SUPERUSER PASSWORD 'testpass';" && \
    createdb -O testuser testdb && \
    /etc/init.d/postgresql stop

USER root

CMD ["bun", "test"]