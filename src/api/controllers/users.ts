import { Request, Response } from "express";

export const createUser = async (_req: Request, res: Response) => {
    res.send({ status: 200, message: "Created a user sucessfully!" });
}