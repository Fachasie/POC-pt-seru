const { Pool } = require('pg');
require('dotenv').config();

// Determine if we're running in Docker or locally
const isDocker = process.env.DOCKER === 'true';

// Prefer a single DATABASE_URL (used by docker-compose env interpolation)
// Fallback to individual environment variables if DATABASE_URL is not provided.
const connectionOptions = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER || process.env.POSTGRES_USER,
      // Use 'db' in Docker, 'localhost' otherwise
      host: process.env.DB_HOST || (isDocker ? 'db' : 'localhost'),
      database: process.env.DB_DATABASE || process.env.POSTGRES_DB,
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    };

const pool = new Pool(connectionOptions);

// Log simple connection events to help debugging in Docker logs
pool.on('connect', () => {
  console.log('Postgres pool connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

module.exports = pool;
