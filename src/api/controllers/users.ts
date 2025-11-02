import client from "@/db/config";
import { userVerify } from "@/helpers/userVerify";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { validatePassword } from "@/helpers/validatePassword";

export const createUser = async (req: Request, res: Response) => {
    const { username, email, role } = req.body;

    if(!username || !email || !role) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!',
            data: {
                success: false
            }
        });
        return;
    }

    if(typeof username === 'undefined' || typeof email === 'undefined' || typeof role === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!',
            data: {
                success: false
            }
        });
        return;
    }

    if(typeof username !== 'string' || typeof email !== 'string' || typeof role !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!',
            data: {
                success: false
            }
        });
        return;
    }

    try {
        const user = await userVerify(email);

        if(!user) {
            res.status(409).send({
                status: 409,
                message: 'User already exists!',
                data: {
                    success: false
                }
            });
            return;
        }

        const hashedPassword = await bcrypt.hash('manager_app', 10);
        
        const query = `SELECT * FROM create_user($1, $2, '', '', '', '', '', '', $3, $4, 'active')`;
        const values = [
            username,
            email,
            hashedPassword,
            role
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
            message: 'Error creating user...',
            data: {
                success: false
            }
        });
    }
    return;
}

export const getUsers = async (req: Request, res: Response) => {
    const { max } = req.query;
    const { userId } = res.locals;

    const query = 'SELECT * FROM get_all_users($1, $2)';
    const values = [max, userId];
    const result = max ? await client.query(query, values) : await client.query(query, [50, userId]);
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

export const getUserDetails = async (req: Request, res: Response) => {
    const { email } = req.body;

    if(!email) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof email === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof email !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    try {
        const query = 'SELECT * FROM get_user_details($1);'
        const result = await client.query(query, [email]);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({ 
                status: 404, 
                message: 'User not found... :(',
            });
            return;
        }

        res.status(200).send({ 
            status: 200, 
            message: 'User Found!',
            data
        });
    } catch (err) {
        console.error('Something went wrong: ', err);
        res.status(404).send({ 
            status: 404, 
            message: 'User not found... :(',
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    if(!email) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof email === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof email !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    try {
        const query = 'SELECT * FROM delete_user($1)';
        const result = await client.query(query, [email]);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'User doens\'t exists!'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: "User was deleted successfully!"
        });
    } catch (err) {
        console.error('Deleting user failed:', err);
        res.status(404).send({
            status: 404,
            message: 'Something went wrong deleting user!'
        });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { username, email, phone, role, address, bio, userStatus } = req.body;

    if(!email || !username || !role || !userStatus) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof email === 'undefined' || typeof username === 'undefined' || typeof phone === 'undefined' || typeof role === 'undefined' || typeof address === 'undefined' || typeof bio === 'undefined' || typeof userStatus === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof email !== 'string' || typeof username !== 'string' || typeof phone !== 'string' || typeof role !== 'string' || typeof address !== 'string' || typeof bio !== 'string' || typeof userStatus !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    try {
        const query = 'SELECT * FROM update_user($1, $2, $3, $4, $5, $6, $7)';
        const values = [username, email, phone, role, address, bio, userStatus]
        const result = await client.query(query, values);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'Something in updating user went wrong...'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: 'User was updated Successfully!',
            data
        })
    } catch (err) {
        console.error('Updating user failed:', err);
        res.status(404).send({
            status: 404,
            message: 'Something in updating user went wrong...'
        });
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword } = req.body;

    if(!email || !currentPassword || !newPassword) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof email === 'undefined' || typeof currentPassword === 'undefined' || typeof newPassword === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof email !== 'string' || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    try {
        const isValid = await validatePassword(email, currentPassword);
        if(!isValid) {
            res.status(400).send({
                status: 400,
                message: "Invalid email or password. Please try again.",
                data: {
                    success: false,
                    token: ''
                }
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = 'SELECT * FROM update_user_password($1, $2)';
        const result = await client.query(query, [email, hashedPassword]);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'Something in reactivating user went wrong...'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: 'Password was Updated Successfully!',
            data
        })
    } catch (err) {
        console.error('Updating password failed:', err);
        res.status(404).send({
            status: 404,
            message: 'Something in updating password went wrong...'
        });
    }
}

export const reactivateUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    if(!email) {
        res.status(400).send({
            status: 400,
            message: 'Missing required fields!'
        });
        return;
    }

    if(typeof email === 'undefined') {
        res.status(400).send({
            status: 400,
            message: 'The values are undefined!'
        });
        return;
    }

    if(typeof email !== 'string') {
        res.status(400).send({
            status: 400,
            message: 'The values aren\'t strings!'
        });
        return;
    }

    try {
        const query = 'SELECT * FROM reactivate_user($1)';
        const result = await client.query(query, [email]);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'Something in reactivating user went wrong...'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: 'User was Reactivated Successfully!',
            data
        })
    } catch (err) {
        console.error('Reactivating user failed:', err);
        res.status(404).send({
            status: 404,
            message: 'Something in reactivating user went wrong...'
        });
    }
}