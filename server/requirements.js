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
                    ) AS PERCENT;
                `,
                [requirementId]
            );
        },
        create: async (driveId, good, quantity) => {
            return await database.row('INSERT INTO REQUIREMENT (DRIVE_ID, GOOD, QUANTITY) VALUES ($1, $2, $3) RETURNING ID', [driveId, good, quantity]);
        }
    }
};

const requirements = Requirements(database);

export default requirements;