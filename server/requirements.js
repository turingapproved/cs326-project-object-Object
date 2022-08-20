import database from "./db.js";

/** Used to query information about requirements from a database.
 * 
 * Uses REQUIREMENT and DONATION tables
 */
const Requirements = (database) => {
    return {
        // Get completion rate
        // The basic sql structure is to count the individual donations
        // and divide it by the total required from the requirement
        // and then normalize to [0, 100]
        getCompletionRate: async (requirementId) => {
            return await database.row(
                `SELECT 
                    (
                        SELECT 
                            COALESCE(SUM(DONATION.QUANTITY), 0)
                        FROM
                            DONATION
                        JOIN REQUIREMENT ON REQUIREMENT_ID = REQUIREMENT.ID
                        WHERE REQUIREMENT.ID = $1
                    )::float
                    /
                    (
                        SELECT
                            QUANTITY
                        FROM REQUIREMENT
                        WHERE REQUIREMENT.ID = $1
                    ) 
                    * 100 AS PERCENT;
                `,
                [requirementId]
            );
        },
        // Create and add a requirement to the given drive
        create: async (driveId, good, quantity) => {
            return await database.row('INSERT INTO REQUIREMENT (DRIVE_ID, GOOD, QUANTITY) VALUES ($1, $2, $3) RETURNING ID', [driveId, good, quantity]);
        },
        getOneById: async (id) => {
            return await database.row('SEELCT * FROM REQUIREMENT WHERE ID = $1', [id]);
        },
        // Add a donation to the drive to the DONATION table
        donate: async (id, donorId, quantity) => {
            return await database.row('INSERT INTO DONATION (DONOR_ID, REQUIREMENT_ID, QUANTITY) VALUES ($1, $2, $3) RETURNING ID', [donorId, id, quantity]);
        }
    }
};

const requirements = Requirements(database);

export default requirements;