import client from "../db/config";

export const userExists = async (id: string) => {
    const query = 'SELECT * FROM user_exists($1)';
    const result = await client.query(query, [id]);

    if(result.rows.length > 1) {
        return;
    }

    return result.rows[0].user_exists === 1;
}