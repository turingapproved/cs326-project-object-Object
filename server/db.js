import { readFile, writeFile } from 'fs/promises';
import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

/** A class representing a database to store scores */
class Database {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    // Create a new Pool. The Pool manages a set of connections to the database.
    // It will keep track of unused connections, and reuse them when new queries
    // are needed. The constructor requires a database URL to make the
    // connection. You can find the URL of your database by looking in Heroku
    // or you can run the following command in your terminal:
    //
    //  heroku pg:credentials:url -a APP_NAME
    //
    // Replace APP_NAME with the name of your app in Heroku.
    this.pool = new Pool({
      connectionString: this.url,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();
  }

  /**
   * Saves a word score to the database.
   *
   * This method reads the database file as an object, adds the new score to the
   * data, and then writes the data back to the database file.
   *
   * @param {string} name the name of the player
   * @param {string} word the word played
   * @param {number} score the score of the word
   */
  async saveWordScore(name, word, score) {
    const query = `INSERT INTO WORD_SCORE (NAME, WORD, SCORE) VALUES ($1, $2, $3) RETURNING NAME, WORD, SCORE;`;
    const res = await this.client.query(query, [name, word, score]);
    return res.rows;
  }

  /**
   * Saves a game score to the database.
   *
   * This method reads the database file as an object, adds the new score to the
   * data, and then writes the data back to the database file.
   *
   * @param {string} name the name of the player
   * @param {number} score the score of the game
   */
  async saveGameScore(name, score) {
    const query = `INSERT INTO GAME_SCORE (NAME, SCORE) VALUES ($1, $2) RETURNING NAME, SCORE;`;
    const res = await this.client.query(query, [name, score]);
    return res.rows;
  }

  /**
   * Returns the top 10 word scores.
   *
   * This method reads the database file as an object, sorts the word scores by
   * word score, and returns the top 10.
   *
   * @returns [{name: string, word: string, score: number}] returns the top 10
   * scores
   */
  async top10WordScores() {
    const query = `SELECT NAME, SCORE, WORD FROM WORD_SCORE ORDER BY SCORE DESC LIMIT 10;`;
    const res = await this.client.query(query);
    return res.rows;
  }

  /**
   * Returns the top 10 game scores.
   *
   * This method reads the database file as an object, sorts the game scores by
   * game score, and returns the top 10.
   *
   * @returns [{name: string, score: number}] returns the top 10 game scores
   */
  async top10GameScores() {
    const query = `SELECT NAME, SCORE FROM GAME_SCORE ORDER BY SCORE DESC LIMIT 10;`;
    const res = await this.client.query(query);
    return res.rows;
  }
}

const database = new Database(process.env.DATABASE_URL);
await database.connect();

export { database };
