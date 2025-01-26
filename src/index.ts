import express, { Request, Response } from 'express';
import 'dotenv/config';

import client from './config/db';
import usersRoutes from './api/routes/users';

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello Friend! :D');
});

app.use('/users/', usersRoutes);
app.use("/user/", usersRoutes);

app.listen(port, () => {
    client;
    console.log(`App is online at: localhost:${port}`);
});