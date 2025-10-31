import client from "@/db/config";

export const userReactivate = async (id: string) => {
    const query = 'SELECT * FROM reactivate_user($1)';
    const result = await client.query(query, [id]);
    const data = result.rows[0];

    return data;
}