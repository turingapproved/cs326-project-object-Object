import database from "./db.js";
import { DONOR, SHELTER } from "./user_types.js";

/** Represents the USER table
 * 
 * Used to query one or all of the users in the table
 * */ 
const Users = (database) => {
    return {
        getAll: async () => {
            return await database.rows('SELECT * FROM "user";');
        },
        getOneById: async (id) => {
            return await database.row('SELECT * FROM "user" WHERE ID = $1;', [id]);
        },
        getOneByName: async (name) => {
            return await database.row('SELECT * FROM "user" WHERE NAME = $1;', [name]);
        },
        // Adds a user, type should be either `shelter` or `donor`
        // Returns the id of the created user. Returns null if
        // type is not one of the specified strings
        add: async (name, password, type) => {
            if (type === 'shelter') {
                return await database.row(
                    `INSERT INTO "user" (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, ${SHELTER}) RETURNING ID`, 
                    [name, password]
                );
            } else if (type === 'donor') {
                return await database.row(
                    `INSERT INTO "user" (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, ${DONOR}) RETURNING ID`, 
                    [name, password]
                );
            }
            return null;
        }
    }
}

const users = Users(database);

export default users;