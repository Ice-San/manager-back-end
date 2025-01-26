import { Request, Response } from "express";

export const createUser = async (_req: Request, res: Response) => {
    res.send({ status: 200, message: 'Created a user sucessfully!' });
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name } = req.query;

    res.send({ status: 200, message: `Get userID ${id} with the name "${name}" and this email ${email}!` })
}