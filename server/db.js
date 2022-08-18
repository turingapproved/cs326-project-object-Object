import { readFile, writeFile } from 'fs/promises';
import 'dotenv/config';
import pg from 'pg';
import { query } from 'express';

// Get the Pool class from the pg module.
const { Pool } = pg;

/** A class representing a database
 * 
 * Used for db specific apis. For table access
 * see the respective files (e.g. users, drives, etc.)
 */
const Database = url => {
    let pool, client;
    
    const query = async (queryString, args=[]) => {
        return await client.query(queryString, args);
    };

    const rows = async (queryString, args) => {
        const res = await query(queryString, args);
        return res.rows;
    };

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
              connectionString: url,
              ssl: { rejectUnauthorized: false }, // Required for Heroku connections
            });
        
            // Create the pool.
            client = await pool.connect();
        },
        client: () => client,
        // Runs the query with the speciifed args, returns the resulting object
        query: query,
        // Like query but specifically designed for SELECT statements, and
        // only returns the rows generated by the query
        rows: rows,
        // Like rows, but returns only the first row, unwrapping it from the list
        // returns null if list is empty
        row: async (queryString, args) => {
            const res = await rows(queryString, args);
            return res[0] || null;
        }
    }
}

const database = Database(process.env.DATABASE_URL);
await database.connect();

export default database;
