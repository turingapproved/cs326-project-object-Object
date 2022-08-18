import database from "./db";

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
                            COALESCE(SUM(DONATION.QUANTITY), 1)
                        FROM REQUIREMENT
                        JOIN DRIVE ON DRIVE_ID = DRIVE.ID
                        WHERE DRIVE.ID = $1
                    ) AS PERCENT;
                `,
                [id]
            );
        }
    }
}

const drives = Drives();

export default drives;