import { Router } from 'express';
import { createUser, deleteUser, getUser, getUsers, reactivateUser } from '../controllers/users';

export default Router()
                    .get('/', getUsers)
                    .get('/:id', getUser)
                    .post('/', createUser)
                    .put('/reactivate', reactivateUser)
                    .delete('/', deleteUser);