import client from "@/db/config";
import { Request, Response } from "express";

export const getKpi = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_kpis()';
        const result = await client.query(query);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'Something went wrong by getting kpis data...'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: 'KPIs data was sent with success!',
            data
        });
    } catch (err) {
        console.error('Something went wrong: ', err);
        res.status(404).send({
            status: 404,
            message: 'Something went wrong by getting kpis data...'
        });
    }
}

export const getActiveUsers = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM get_active_users_kpi()';
        const result = await client.query(query);
        const data = result.rows[0];

        if(!data) {
            res.status(404).send({
                status: 404,
                message: 'Something went wrong by getting kpis data...'
            });
            return;
        }

        res.status(200).send({
            status: 200,
            message: 'KPIs data was sent with success!',
            data
        });
    } catch (err) {
        console.error('Something went wrong: ', err);
        res.status(404).send({
            status: 404,
            message: 'Something went wrong by getting kpis data...'
        });
    }
} 