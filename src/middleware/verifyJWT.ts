import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { userExists } from '@/helpers/userExists';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers['authorization'];
        const { JWT } = process.env;

        if(!authorization) {
            res.status(401).send({
                status: 401,
                message: "Invalid Token"
            });
            return;
        }

        const [ bearer, token ] = authorization.split(' ');

        if(bearer !== "Bearer") {
            res.status(401).send({
                status: 401,
                message: "Invalid Token"
            });
            return;
        }

        if(typeof token !== "string") {
            res.status(400).send({
                status: 400,
                message: "Invalid Token"
            });
            return;
        }

        const payload = jwt.verify(token, JWT as string)
        const { userId } = payload as JwtPayload;

        if(!userId) {
            res.status(400).send({
                status: 400,
                message: "Invalid Token"
            });
            return;
        }

        const user = await userExists(userId);

        if(!user) {
            res.status(404).send({
                status: 404,
                message: "User Not Found"
            });
            return;
        }

        res.locals.userId = userId;
        next();
    } catch (err) {
        if(err instanceof jwt.JsonWebTokenError) {
            res.status(401).send({
                status: 401,
                message: "Token Expired"
            });
            return;
        }

        res.status(500).send({
            status: 500,
            message: "Something goes wrong..."
        });
    }
}