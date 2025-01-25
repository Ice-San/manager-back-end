import { Router } from 'express';
import { createUser } from '../controllers/users';

export default Router()
                    .post('/', createUser);