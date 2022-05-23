<p align="center">
  <a href="https://neftie.io">
    <img src="https://github.com/neftielabs/neftie/blob/main/.github/assets/icon.png?raw=true" width="250" />
    <h3 align="center">neftie</h3>
  </a>
</p>

<p align="center">
  Blockchain-powered freelancing
</p>

---

# Table of contents

- [Table of contents](#table-of-contents)
- [Local development](#local-development)
  - [Clone and install dependencies](#clone-and-install-dependencies)
  - [Set up the databases](#set-up-the-databases)
  - [Run database migrations](#run-database-migrations)
  - [Add environment variables](#add-environment-variables)
  - [Start the development servers](#start-the-development-servers)

# Local development

Follow this steps to set up the neftie platform locally.

### Clone and install dependencies

Clone the repository

```sh
$ git clone https://github.com/neftielabs/neftie
```

Navigate to the new directory and install all dependencies by running `yarn`

### Set up the databases

Redis and Postgres run within Docker. Install it if you haven't already and run

```sh
$ docker-compose up -d
```

This will bring up both `neftie-redis` and `neftie-postgres`. User and pass are available
in the Docker Compose file.

### Run database migrations

Since migrations are not set up yet, to migrate the database run `yarn pr push`. This should initialize the database and generate the Prisma Client.

### Add environment variables

Inside each workspace that requires env variables there should be a `.env.example` file, from which you should create the `.env` file.

### Start the development servers

To start all development servers run `yarn dev`. This will start the backend and frontend, and start watching all other workspaces for changes.

Now visit `http://localhost:3000` and you should see the neftie homepage.
