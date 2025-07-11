import pg from 'pg';

const {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    RAILWAY_DB_USER,
    RAILWAY_DB_HOST,
    RAILWAY_DB_NAME,
    RAILWAY_DB_PASSWORD,
    RAILWAY_DB_PORT
} = process.env;

const client = new pg.Client({
    user: RAILWAY_DB_USER || DB_USER,
    host: RAILWAY_DB_HOST || DB_HOST,
    database: RAILWAY_DB_NAME || DB_NAME,
    password: RAILWAY_DB_PASSWORD || DB_PASSWORD,
    port: Number(RAILWAY_DB_PORT || DB_PORT),
});

client
    .connect()
    .then(() => console.log("Sucessfully connect to PostgreSQL Database!\n"))
    .catch((err) => console.error("Connection Error: " + err.stack));

export default client;