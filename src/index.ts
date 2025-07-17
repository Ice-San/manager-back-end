import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

import { middleware } from './middleware';

import client from './db/config';

import usersRoutes from './api/routes/users';
import authRoutes from './api/routes/auth';

const { 
    PORT, 
    RENDER_PUBLIC_DOMAIN, 
    RAILWAY_PUBLIC_DOMAIN 
} = process.env;

const app = express();
const port = PORT || 3000;
const domain = RAILWAY_PUBLIC_DOMAIN || RENDER_PUBLIC_DOMAIN || "localhost";

app.use(cors());
app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello Friend!');
});

app.use('/users', middleware, usersRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    client;

    let url;
    switch (domain) {
        case RAILWAY_PUBLIC_DOMAIN:
            url = `Public URL (Railway): https://${RAILWAY_PUBLIC_DOMAIN}`;
            break;
        case RENDER_PUBLIC_DOMAIN:
            url = `Public URL (Render): ${RENDER_PUBLIC_DOMAIN}`;
            break;
        default:
            url = `Local URL: http://localhost:${port}`;
            break;
    }

    console.log(`App is online at: ${url}`);
});