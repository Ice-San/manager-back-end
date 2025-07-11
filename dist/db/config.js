"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT } = process.env;
const client = new pg_1.default.Client({
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
exports.default = client;
