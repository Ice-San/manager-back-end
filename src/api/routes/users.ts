import { Router } from 'express';
import { createUser, getUser } from '../controllers/users';

export default Router()
                    .get('/:id', getUser)
                    .post('/', createUser);