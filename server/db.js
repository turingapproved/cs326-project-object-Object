import { readFile, writeFile } from 'fs/promises';
import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

/** A class representing a database
 * 
 * Used for db specific apis. For table access
 * see the respective files (e.g. users, drives, etc.)
 */
const Database = url => {
    let pool, client;
    return {
        connect: async () => {
            // Create a new Pool. The Pool manages a set of connections to the database.
            // It will keep track of unused connections, and reuse them when new queries
            // are needed. The constructor requires a database URL to make the
            // connection. You can find the URL of your database by looking in Heroku
            // or you can run the following command in your terminal:
            //
            //  heroku pg:credentials:url -a APP_NAME
            //
            // Replace APP_NAME with the name of your app in Heroku.
            pool = new Pool({
              connectionString: this.url,
              ssl: { rejectUnauthorized: false }, // Required for Heroku connections
            });
        
            // Create the pool.
            client = await this.pool.connect();
        },
        client: () => client
    }
}

const database = new Database(process.env.DATABASE_URL);
await database.connect();

export { database };
