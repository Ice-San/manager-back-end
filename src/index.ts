import '@/globals/extensions/string';

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import client from '@/db/config';

import { verifyJWT } from '@/middleware/verifyJWT';

import helloRoutes from '@/api/routes/hello';
import authRoutes from '@/api/routes/auth';
import usersRoutes from '@/api/routes/users';

import { getDomain } from '@/helpers/getDomain';

const app = express();
const domain = getDomain();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/hello', helloRoutes);
app.use('/auth', authRoutes);
app.use('/users', verifyJWT, usersRoutes);

app.listen(port , () => {
    client;
    const url = `${domain.type.toCapitalize()} URL (${domain.provider.toCapitalize()}): ${domain.url.toCapitalize()}`;
    console.log(`App is online at: ${url}`);
});