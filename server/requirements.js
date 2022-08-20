import database from "./db.js";

const Requirements = (database) => {
    return {
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
        create: async (driveId, good, quantity) => {
            return await database.row('INSERT INTO REQUIREMENT (DRIVE_ID, GOOD, QUANTITY) VALUES ($1, $2, $3) RETURNING ID', [driveId, good, quantity]);
        },
        getOneById: async (id) => {
            return await database.row('SEELCT * FROM REQUIREMENT WHERE ID = $1', [id]);
        },
        donate: async (id, donorId, quantity) => {
            return await database.row('INSERT INTO DONATION (DONOR_ID, REQUIREMENT_ID, QUANTITY) VALUES ($1, $2, $3) RETURNING ID', [donorId, id, quantity]);
        }
    }
};

const requirements = Requirements(database);

export default requirements;