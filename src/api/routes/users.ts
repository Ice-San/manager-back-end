import { Router } from 'express';
import { createUser, deleteUser, getUserDetails, getUsers, reactivateUser } from '../controllers/users';

export default Router()
                    .get('/', getUsers)
                    .post('/details', getUserDetails)
                    .post('/', createUser)
                    .put('/reactivate', reactivateUser)
                    .delete('/', deleteUser);