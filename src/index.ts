import express from 'express';
import 'dotenv/config';

import client from './config/db';

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
    res.send('Hello Friend! :D');
});

app.listen(port, () => {
    client;
    console.log(`App is online at: localhost:${port}`);
});