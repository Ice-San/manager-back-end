import { Router } from 'express';
import { createUser, deleteUser, getUserDetails, getUsers, reactivateUser, updatePassword, updateUser } from '../controllers/users';

export default Router()
                    .get('/', getUsers)
                    .post('/details', getUserDetails)
                    .post('/', createUser)
                    .put('/', updateUser)
                    .put('/password', updatePassword)
                    .put('/reactivate', reactivateUser)
                    .delete('/', deleteUser);