import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
    res.send('Hello Friend! :D');
});

app.listen(port, () => {
    console.log(`App is online at: https:\\localhost:${port}`);
});