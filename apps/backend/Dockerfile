# ------------------------------
# Base        
# ------------------------------
#
# Install any package globally required and set shared env vars
#
# ---------------------------------------------------------------------------

FROM node:20-alpine AS base

RUN apk add --no-cache coreutils

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

# Copy all required files (package.json from all workspaces).
# Copying the source and using `find` would be much easier, but then docker won't
# cache anything when the source changes
# An example command would be:
#   COPY ./ ./src
#   RUN cd src && \
#     find . -name 'package.json' \! -path '*\.vscode*' | xargs cp --parents -t ../manifests/ && \
#     cp yarn.lock ../manifests/ && \
#     cp .yarnrc.yml ../manifests/ && \
#     cp -R .yarn/releases ../manifests/.yarn && \
#     cp -R .yarn/plugins ../manifests/.yarn

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

RUN yarn workspaces focus --production @neftie/backend

# Move production dependencies aside

RUN cp -R node_modules prod_node_modules

# Install all dependencies

RUN yarn workspaces focus @neftie/backend

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

# Copy sources and run codegen

COPY tsconfig.json        ./

COPY packages/prisma      packages/prisma
RUN yarn pr generate

COPY packages/contracts   packages/contracts
RUN yarn cs compile

COPY packages/subgraph    packages/subgraph
RUN yarn sg codegen

COPY packages/common      packages/common
COPY apps/backend         apps/backend

# Build everything using `tsc -b`

RUN yarn be build

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

RUN mkdir -p apps/backend packages/common packages/contracts packages/prisma packages/subgraph

COPY --from=builder /app/tsconfig.json                        .

COPY --from=builder /app/apps/backend/package.json            apps/backend/package.json
COPY --from=builder /app/apps/backend/tsconfig.json           apps/backend/tsconfig.json
COPY --from=builder /app/apps/backend/dist                    apps/backend/dist
COPY --from=builder /app/apps/backend/.env.project            apps/backend/.env.project

COPY --from=builder /app/packages/common/package.json         packages/common/package.json
COPY --from=builder /app/packages/common/dist                 packages/common/dist
COPY --from=builder /app/packages/contracts/package.json      packages/contracts/package.json
COPY --from=builder /app/packages/contracts/dist              packages/contracts/dist
COPY --from=builder /app/packages/subgraph/package.json       packages/subgraph/package.json
COPY --from=builder /app/packages/subgraph/dist               packages/subgraph/dist
COPY --from=builder /app/packages/prisma/package.json         packages/prisma
COPY --from=builder /app/packages/prisma/dist                 packages/prisma/dist
COPY --from=builder /app/packages/prisma/src/migrations       packages/prisma/src/migrations
COPY --from=builder /app/packages/prisma/src/schema.prisma    packages/prisma/src

RUN mkdir -p /app/apps/backend/logs /app/apps/backend/public

# ------------------------------
# Runner
# ------------------------------
#
# Run the production image
#
# ---------------------------------------------------------------------------

FROM base AS runner

WORKDIR /app

COPY --from=prerunner --chown=node:node /app ./

WORKDIR /app/apps/backend

# Set environment variables

ARG DOTENV_ME
ARG DATABASE_URL
ENV DATABASE_URL      $DATABASE_URL
ENV TS_NODE_BASEURL   ./dist
ENV NODE_ENV          production


# Prevent app from running as root

USER node

# Open ports

EXPOSE 5000

# Pull env, apply pending db migrations and run app

CMD npx --yes dotenv-vault@latest pull production .env --dotenvMe $DOTENV_ME && \
  yarn db:migrate && \
  node -r tsconfig-paths/register ./dist/app.js