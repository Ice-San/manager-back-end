import client from "@/db/config";
import { Request, Response } from "express";

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
        
    if(typeof email === "undefined" || typeof password === "undefined") {
        res.status(400).send({
            status: 400,
            message: "The values are undefined!"
        });
        return;
    }

    if(typeof email !== "string" && typeof password !== "string") {
        res.status(400).send({
            status: 400,
            message: "The values aren't strings!"
        });
        return;
    }

    try {
        const query: string = 'SELECT * FROM sign_in($1, $2)';
        const values: string[] = [email, password];
        const result = await client.query(query, values);
        const userId: string = result.rows[0]?.u_id;

        if(result.rows.length) {
            res.status(200).json({
                status: 200,
                message: 'Success SignIn!',
                data: {
                    success: true,
                    userId
                }
            });
            return;
        }

        res.status(401).json({
            status: 401,
            message: 'Invalid credencials!',
            data: {
                success: false
            }
        });
    } catch(err) {
        console.log(err);

        res.status(500).send({
            status: 500,
            message: 'Error Code!'
        });
    }
    return;
}