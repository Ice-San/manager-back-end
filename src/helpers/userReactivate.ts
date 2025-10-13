import client from "@/db/config";

export const userReactivate = async (id: number) => {
    const query = 'SELECT * FROM reactivate_user($1)';
    const result = await client.query(query, [id]);
    const data = result.rows[0];

    return data;
}