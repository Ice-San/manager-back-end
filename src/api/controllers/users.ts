import client from "@/db/config";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;

    if(!username || !email || !password || !confirmPassword) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof username === 'undefined' || typeof email === 'undefined' || typeof password === 'undefined' || typeof confirmPassword === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    if(password !== confirmPassword) {
        res.status(400).send({
            status: 400,
            message: 'Passwords don\'t matchs!'
        });
        return;
    }

    try {
        const queryUserExist = await client.query(`SELECT user_exist('${email}')`);
        const { user_exist } = queryUserExist.rows[0];

        if(user_exist === 1) {
            res.status(409).send({
                status: 409,
                message: 'User already exists!'
            });
            return;
        }

        const query = `SELECT * FROM create_user($1, $2, '', '', '', $3, 'user', 3)`;
        const values = [
            username,
            email,
            password,
        ];
        const result = await client.query(query, values);
        const userId: string = result.rows[0].user_id;

        res.status(201).send({
            status: 201,
            message: 'User Created Sucessfully!',
            data: {
                success: true,
                userId
            }
        });
    } catch (err) {
        console.log(err);
        
        res.status(500).send({
            status: 500,
            message: 'Error creating user...'
        });
    }
    return;
}

export const getUsers = async (req: Request, res: Response) => {
    const { career, location } = req.query;

    const query = career || location ? `SELECT * FROM users WHERE u_location = ${location} OR u_career = ${career};` : 'SELECT * FROM users';
    const result = await client.query(query);
    const data = result.rows;

    if(!data)
        res.status(404).send({ 
            status: 404, 
            message: 'Users not found... :(',
        });

    res.status(200).send({ 
        status: 200, 
        message: 'Users Found!',
        data
    });
}

export const getUser = async (req: Request, res: Response) => {
    const { userId } = res.locals;

    const query = `SELECT * FROM get_user($1);`
    const result = await client.query(query, [userId]);
    const data = result.rows[0];

    if(!data)
        res.status(404).send({ 
            status: 404, 
            message: 'User not found... :(',
        });

    res.status(200).send({ 
        status: 200, 
        message: 'User Found!',
        data
    });
}