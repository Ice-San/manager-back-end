import pg from 'pg';

const {
    DB_USER,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    PGUSER,
    PGHOST,
    PGDATABASE,
    PGPASSWORD,
    PGPORT
} = process.env;

const client = new pg.Client({
    user: PGUSER || DB_USER,
    host: PGHOST || DB_HOST,
    database: PGDATABASE || DB_NAME,
    password: PGPASSWORD || DB_PASSWORD,
    port: Number(PGPORT || DB_PORT),
});

client
    .connect()
    .then(() => console.log("Sucessfully connect to PostgreSQL Database!\n"))
    .catch((err) => console.error("Connection Error: " + err.stack));

export default client;