import bcrypt from 'bcrypt';
import client from "@/db/config";

export const validatePassword = async (email: string, password: string) => {
    const query = 'SELECT * FROM get_password($1);';
    const result = await client.query(query, [email]);
    const data = result.rows[0];

    return await bcrypt.compare(password, data?.hashed_password);
}