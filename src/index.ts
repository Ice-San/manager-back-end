import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

import client from './db/config';
import usersRoutes from './api/routes/users';
import authRoutes from './api/routes/auth';

const app = express();
const port = process.env.PORT || 3000;
const domain = process.env.RAILWAY_PRIVATE_DOMAIN || "localhost";

app.use(cors());
app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello Friend!');
});

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    client;
    console.log(`App is online at: http://${domain}:${port}`);
});