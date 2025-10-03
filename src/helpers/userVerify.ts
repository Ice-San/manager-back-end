import client from "../db/config";

export const userVerify = async (email: string) => {
    const result = await client.query('SELECT user_verify($1)', [email]);

    if(result.rows.length > 1) {
        return;
    }

    return result.rows[0].user_verify < 1;
}