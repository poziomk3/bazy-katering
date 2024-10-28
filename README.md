# This is project na bazy danych (system kateringowy)

This project provides a PostgreSQL database and pgAdmin for managing the database via Docker Compose.

## Requirements
- Stąd można dockera `https://www.docker.com/products/docker-desktop/`
- Stąd można node i npm `https://docs.npmjs.com/downloading-and-installing-node-js-and-npm`


## Co zrobić żeby działał projekt

1. Clone the repository.
2. Run the following command to start db and db-admin:
   ```bash
   docker-compose up
   ```
3.Run this to download dependencies (prisma)
```
npm i
```

## UWAGA WAŻNE!
Komenda odpala script, który mamy w lab4/seed.ts - to będzie entry point do seeedowania
```
  npm run seed
  ```

## Database Management

To manage the database, you can use the following npm scripts:

- **Seed the database**: Populate the database with initial data.
   ```bash
   npm run seed
   ```

- **Pull the database schema**: Update your Prisma schema with the current state of your database.
   ```bash
   npm run pull
   ```

- **Run migrations**: Apply any pending migrations to your database.
   ```bash
   npm run migrate
   ```

- **Generate Prisma client**: Generate the Prisma client based on your schema.
   ```bash
   npm run generate
   ```