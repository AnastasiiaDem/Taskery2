import express from 'express';

const auth = require("express").Router();

import createUser from '../controllers/registerController';
import loginUser from '../controllers/loginController';
import logoutUser from '../controllers/logoutController';
import refreshToken from '../controllers/refreshTokenController';

auth.get('/', (req: express.Request, res: express.Response) => {
  res.send('AUTH');
});

auth.post('/register', createUser);
auth.post('/login', loginUser);
auth.get('/logout', logoutUser);
auth.get('/refresh', refreshToken);

module.exports = auth;
