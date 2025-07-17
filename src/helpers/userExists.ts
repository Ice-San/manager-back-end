import client from "../db/config";

export const userExists = async (id: number) => {
    const query = `SELECT * FROM user_exist($1)`;
    const result = await client.query(query, [id]);

    return result.rows.length < 0;
}