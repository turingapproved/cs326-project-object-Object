import { database } from "./db";
import { DONOR, SHELTER } from "./user_types";

/** Represents the USER table
 * 
 * Used to query one or all of the users in the table
 * */ 
const Users = (database) => {
    return {
        getAll: () => {
            return await database.rows('SELECT * FROM "user";');
        },
        getOneById: (id) => {
            return await database.row('SELECT * FROM "user" WHERE ID = $1;', [id]);
        },
        getOneByName: (name) => {
            return await database.row('SELECT * FROM "user" WHERE NAME = $1;', [name]);
        },
        // Adds a user, type should be either `shelter` or `donor`
        // Returns the id of the created user. Returns null if
        // type is not one of the specified strings
        add: (name, password, type) => {
            if (type === 'shelter') {
                return await database.row(`INSERT INTO USER (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, ${SHELTER})`, [name, password]);
            } else if (type === 'donor') {
                return await database.row(`INSERT INTO USER (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, ${DONOR})`, [name, password]);
            }
            return null;
        }
    }
}

export const users = Users();