import jsonwebtoken from 'jsonwebtoken';

const { JWT } = process.env;

export const generateToken = (payload: Object | string) => {
    return jsonwebtoken.sign(payload, JWT as string, { expiresIn: "7d" });
}