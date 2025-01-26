import { Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/users';

export default Router()
                    .get('/', getUsers)
                    .get('/:id', getUser)
                    .post('/', createUser);