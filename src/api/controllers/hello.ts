import { Request, Response } from "express";

export const hello = (_req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        message: 'Hello Friend!'
    });
}