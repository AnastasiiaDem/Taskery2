import express from 'express';
import {deleteUser, getAllUsers, getCurrentUser, updateUser} from '../src/controllers/userController';

const user = require('express').Router();

user.get('/', (req: express.Request, res: express.Response) => {
  res.send('USER');
});

user.get('/all', getAllUsers);
user.get('/current', getCurrentUser);
user.put('/update', updateUser);
user.delete('/delete/:id', deleteUser);

module.exports = user;
