import database from "./db.js";
import { DONOR, SHELTER } from "./user_types.js";

/** Represents the USER table
 * 
 * Used to query one or all of the users in the table
 * Also uses the DRIVE_VIEW table
 * */ 
const Users = (database) => {
    return {
        // Get all users
        getAll: async () => {
            return await database.rows('SELECT * FROM "user";');
        },
        // Get one by its id
        getOneById: async (id) => {
            return await database.row('SELECT * FROM "user" WHERE ID = $1;', [id]);
        },
        // Get a user by its name
        getOneByName: async (name) => {
            return await database.row('SELECT * FROM "user" WHERE NAME = $1;', [name]);
        },
        // Adds a user, type should be either `shelter` or `donor`
        // Returns the id of the created user. Returns null if
        // type is not one of the specified strings
        add: async (name, password, type) => {
            if (type === 'shelter') {
                return await database.row(
                    `INSERT INTO "user" (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, $3) RETURNING ID`, 
                    [name, password, SHELTER]
                );
            } else if (type === 'donor') {
                return await database.row(
                    `INSERT INTO "user" (NAME, PASSWORD, USER_TYPE_ID) VALUES ($1, $2, $3) RETURNING ID`, 
                    [name, password, DONOR]
                );
            }
            return null;
        },
        // Gets the users recently viewed drives, user should be a donor
        getRecentlyViewed: async (donorId, limit=10) => {
            return await database.rows(`
            SELECT
                DRIVE.* 
            FROM DRIVE_VIEW 
            JOIN DRIVE ON DRIVE_VIEW.DRIVE_ID = DRIVE.ID
            WHERE USER_ID = $1 
            GROUP BY DRIVE.ID
            ORDER BY MAX(TIME) DESC LIMIT $2`, [donorId, limit]);
        },
        // Gets the user's recently created drives, user should be a shelter
        getRecentlyCreated: async (shelterId, limit=10) => {
            return await database.rows(`SELECT * FROM DRIVE WHERE CREATOR_ID = $1 ORDER BY CREATED_TIME DESC LIMIT $2`, [shelterId, limit])
        },
        // Mark the given user as having viewed the given drive
        view: async (userId, driveId) => {
            await database.query(`INSERT INTO DRIVE_VIEW (DRIVE_ID, USER_ID) VALUES ($1, $2)`, [driveId, userId]);
        }
    }
}

const users = Users(database);

export default users;