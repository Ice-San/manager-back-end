import client from "@/db/config";
import { Request, Response } from "express";

export const createUser = async (_req: Request, res: Response) => {
    console.log('createUser - Working');

    res.send({ status: 200, message: 'Created a user sucessfully!' });
}

export const getUsers = async (req: Request, res: Response) => {
    const { career, location } = req.query;

    const query = career || location ? `SELECT * FROM users WHERE u_location = ${location} OR u_career = ${career};` : 'SELECT * FROM users';
    const result = await client.query(query);
    const data = result.rows;

    if(!data)
        res.send({ 
            status: 404, 
            message: 'Users not found... :(',
        });

    res.send({ 
        status: 200, 
        message: 'Users Found!',
        data
    });
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await client.query(`SELECT * FROM users WHERE u_id = ${id};`);
    const data = result.rows[0];

    if(!data)
        res.send({ 
            status: 404, 
            message: 'User not found... :(',
        });

    res.send({ 
        status: 200, 
        message: 'User Found!',
        data
    });
}