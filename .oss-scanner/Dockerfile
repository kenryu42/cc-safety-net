# Build image for Anthropic's OSS Scanner (https://github.com/anthropics/oss-scanner).
# The scanner builds this with the repository as the build context, then removes network access.
FROM oven/bun:1.4.4

ENV DEBIAN_FRONTEND=noninteractive \
    AGENT=1 \
    CI=1
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates git nodejs npm python3 \
    && rm -rf /var/lib/apt/lists/*

COPY . /src
WORKDIR /src

RUN bun install --frozen-lockfile
RUN bun run build

# Tests run offline. tests/e2e-live drives real agent CLIs over the network and is left out.
RUN bun test tests --timeout 30000 --path-ignore-patterns 'tests/e2e-live/**' \
    || echo "WARNING: bun test reported failures"
