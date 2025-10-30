import client from "@/db/config";
import { generateToken } from "@/helpers/jwt";
import { Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';

const { JWT } = process.env;

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
        
    if(typeof email === "undefined" || typeof password === "undefined") {
        res.status(400).send({
            status: 400,
            message: "The values are undefined!",
            data: {
                success: false,
                token: ''
            }
        });
        return;
    }

    if(typeof email !== "string" && typeof password !== "string") {
        res.status(400).send({
            status: 400,
            message: "The values aren't strings!",
            data: {
                success: false,
                token: ''
            }
        });
        return;
    }

    try {
        const query: string = 'SELECT * FROM sign_in($1, $2)';
        const values: string[] = [email, password];
        const result = await client.query(query, values);
        const userId: string = result.rows[0]?.u_id;

        if(!userId) {
            res.status(404).send({
                status: 404,
                message: "User doesn't exists!",
                data: {
                    success: false,
                    token: ''
                }
            })
            return;
        }

        if(result.rows.length) {
            const token = generateToken({userId});

            res.status(200).json({
                status: 200,
                message: 'Success SignIn!',
                data: {
                    success: true,
                    token
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

export const validation = async (req: Request, res: Response) => {
    const { token } = req.body;

    jsonwebtoken.verify(token, JWT as string, async (err: any, payload: any) => {
        if(err) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized!',
                data: {
                    success: false
                }
            });
            return;
        }

        const userId = payload?.userId;

        if(userId) {
            res.status(200).json({
                status: 200,
                message: 'Authorized!',
                data: {
                    success: true
                }
            });
            return;
        }

        res.status(401).json({
            status: 401,
            message: 'Unauthorized!',
            data: {
                success: false
            }
        });
    });
}