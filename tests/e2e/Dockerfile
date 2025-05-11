FROM selenium/standalone-firefox:latest

USER root

# Install Bun, xdotool, x11vnc and other dependencies
RUN apt-get update && \
    apt-get install -y curl unzip xdotool fluxbox x11vnc ca-certificates libnss3-tools psmisc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Install Bun to a specific location and make sure it's in PATH
RUN curl -fsSL https://bun.sh/install | bash

# Set Firefox configuration
ENV FIREFOX_BIN=/usr/bin/firefox
ENV DISPLAY=:50.0
ENV CHECKUNTIL_TIMEOUT=10000


# Set up working directory
WORKDIR /app

USER seluser

# The actual run script will be mounted at runtime
CMD ["bash"]
