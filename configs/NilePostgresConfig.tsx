import { Pool } from 'pg';

export const  pool  = new Pool ({
  user: process.env.EXPO_PUBLIC_DB_USERNAME,
  password: process.env.EXPO_PUBLIC_DB_PASSWORD,
  host: 'us-west-2.db.thenile.dev',
  port: 5432,
  database: 'recipe_gram_prod_app',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout after 2 seconds if connection fails
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit the process if there's an error
});