# ------------------------------
# Base        
# ------------------------------
#
# Install any package globally required and set shared env vars
#
# ---------------------------------------------------------------------------

FROM node:16-alpine AS base

RUN apk add --no-cache coreutils libc6-compat

ENV CI=true

# ------------------------------
# Dependencies        
# ------------------------------
#
# Grab all necessary files to do a `yarn install`. This means every
# yarn file and all `package.json` from all workspaces
#
# ---------------------------------------------------------------------------

FROM base AS dependencies

WORKDIR /app

COPY yarn.lock .yarnrc.yml            .
COPY .yarn/releases                   .yarn/releases
COPY .yarn/plugins                    .yarn/plugins

COPY package.json                     .
COPY apps/backend/package.json        apps/backend/package.json
COPY apps/frontend/package.json       apps/frontend/package.json
COPY packages/contracts/package.json  packages/contracts/package.json
COPY packages/subgraph/package.json   packages/subgraph/package.json
COPY packages/prisma/package.json     packages/prisma/package.json
COPY packages/common/package.json     packages/common/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/cli/package.json        packages/cli/package.json

# Install production dependencies

RUN yarn workspaces focus --production @neftie/frontend

# Move production dependencies aside

RUN cp -R node_modules prod_node_modules

# Install all dependencies

RUN yarn workspaces focus @neftie/frontend

# ------------------------------
# Builder
# ------------------------------
#
# Build all workspaces, generate Prisma Clients and
# other services/dependencies
#
# ---------------------------------------------------------------------------

FROM base AS builder

ENV CI=true
ENV NODE_ENV=production

WORKDIR /app

# Copy required files from dependencies

COPY --from=dependencies /app/node_modules                                    ./node_modules
COPY --from=dependencies /app/yarn.lock /app/.yarnrc.yml /app/package.json    ./
COPY --from=dependencies /app/.yarn                                           ./.yarn
COPY --from=dependencies /app/apps                                            ./apps
COPY --from=dependencies /app/packages                                        ./packages

# Copy sources and run codegen / build

COPY tsconfig.json        ./
COPY .eslintrc.yml        ./

COPY packages/prisma      packages/prisma
RUN yarn pr generate && \
  yarn pr build

COPY packages/contracts   packages/contracts
RUN yarn cs build

COPY packages/subgraph    packages/subgraph
RUN yarn sg codegen && \
  yarn sg build

COPY packages/common      packages/common
RUN yarn cm build

COPY packages/api-client  packages/api-client
RUN yarn ac build

COPY apps/frontend        apps/frontend

# Build the frontend

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN

# `NEXT_PUBLIC_*` env vars need to be set before build

RUN --mount=type=secret,id=browser_env,dst=/app/apps/frontend/.env \
  yarn fe build

# ------------------------------
# Prerunner
# ------------------------------
#
# Generate the production image
#
# ---------------------------------------------------------------------------

FROM base AS prerunner

WORKDIR /app

# Copy manifests

COPY --from=dependencies  /app/yarn.lock /app/.yarnrc.yml /app/package.json    .
COPY --from=dependencies  /app/.yarn                                           .yarn
COPY --from=dependencies  /app/prod_node_modules                               node_modules
COPY --from=builder       /app/node_modules/.prisma                            node_modules/.prisma
COPY --from=builder       /app/node_modules/@prisma/client                     node_modules/@prisma/client

# Copy built packages

RUN mkdir -p apps/frontend packages/common packages/contracts packages/prisma packages/subgraph packages/api-client

COPY --from=builder /app/tsconfig.json                        .

COPY --from=builder /app/apps/frontend/.next                    apps/frontend/.next
COPY --from=builder /app/apps/frontend/public                   apps/frontend/public
COPY --from=builder /app/apps/frontend/.babelrc.js              apps/frontend
COPY --from=builder /app/apps/frontend/.env.project             apps/frontend
COPY --from=builder /app/apps/frontend/next.config.js           apps/frontend
COPY --from=builder /app/apps/frontend/sentry.client.config.js  apps/frontend
COPY --from=builder /app/apps/frontend/sentry.server.config.js  apps/frontend
COPY --from=builder /app/apps/frontend/sentry.properties        apps/frontend
COPY --from=builder /app/apps/frontend/package.json             apps/frontend

COPY --from=builder /app/packages/common/package.json         packages/common/package.json
COPY --from=builder /app/packages/common/dist                 packages/common/dist
COPY --from=builder /app/packages/contracts/package.json      packages/contracts/package.json
COPY --from=builder /app/packages/contracts/dist              packages/contracts/dist
COPY --from=builder /app/packages/subgraph/package.json       packages/subgraph/package.json
COPY --from=builder /app/packages/subgraph/dist               packages/subgraph/dist
COPY --from=builder /app/packages/prisma/package.json         packages/prisma
COPY --from=builder /app/packages/prisma/dist                 packages/prisma/dist
COPY --from=builder /app/packages/api-client/package.json     packages/api-client
COPY --from=builder /app/packages/api-client/dist             packages/api-client/dist

# Create the directory to persist already optimized images

RUN mkdir -p /usr/app/apps/frontend/.next/cache/images

# ------------------------------
# Runner
# ------------------------------
#
# Run the production image
#
# ---------------------------------------------------------------------------

FROM base AS runner

WORKDIR /app

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

COPY --from=prerunner /app ./

WORKDIR /app/apps/frontend

# Set environment variables

ARG DOTENV_ME
ENV NODE_ENV  production

# Prevent app from running as root

# USER nextjs

# Open ports

EXPOSE 3000

# Run app

CMD npx --yes dotenv-vault@latest pull production .env --dotenvMe $DOTENV_ME && \
  ../../node_modules/.bin/next start