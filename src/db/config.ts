import pg from 'pg';

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = process.env;

const client = new pg.Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
});

client
    .connect()
    .then(() => console.log("Sucessfully connect to PostgreSQL Database!\n"))
    .catch((err) => console.error("Connection Error: " + err.stack));

export default client;