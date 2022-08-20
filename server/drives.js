import database from "./db.js";

const Drives = (database) => {
    return {
        getOneById: async (id) => {
            return await database.row('SELECT * FROM DRIVE WHERE ID = $1', [id]);
        },
        getCompletionRate: async (id) => {
            return await database.row(
                `SELECT 
                    (
                        SELECT 
                            COALESCE(SUM(DONATION.QUANTITY), 0)
                        FROM
                            DONATION
                        JOIN REQUIREMENT ON REQUIREMENT_ID = REQUIREMENT.ID
                        JOIN DRIVE ON DRIVE_ID = DRIVE.ID
                        WHERE DRIVE.ID = $1
                    )::float
                    /
                    (
                        SELECT
                            COALESCE(SUM(REQUIREMENT.QUANTITY), 1)
                        FROM REQUIREMENT
                        JOIN DRIVE ON DRIVE_ID = DRIVE.ID
                        WHERE DRIVE.ID = $1
                    ) 
                    * 100 AS PERCENT;
                `,
                [id]
            );
        },
        create: async (name, location, manager, contact_info, creator_id) => {
            return await database.row(`INSERT INTO DRIVE (NAME, LOCATION, MANAGER, CONTACT_INFO, CREATOR_ID)
            VALUES ($1, $2, $3, $4, $5) RETURNING ID`, [name, location, manager, contact_info, creator_id]);
        },
        search: async (query) => {
            return await database.rows(`SELECT * FROM DRIVE WHERE NAME LIKE '%' || $1 || '%'`, [query]);
        },
        getRequirements: async (id) => {
            return await database.rows('SELECT * FROM REQUIREMENT WHERE DRIVE_ID = $1', [id]);
        },
        delete: async (id) => {
            // Clear potential references 
            await database.query('DELETE FROM DRIVE_VIEW WHERE DRIVE_ID = $1', [id]);
            await database.query('DELETE FROM REQUIREMENT WHERE DRIVE_ID = $1', [id]);
            await database.query('DELETE FROM DRIVE WHERE ID = $1', [id]);
        }
    }
}

const drives = Drives(database);

export default drives;