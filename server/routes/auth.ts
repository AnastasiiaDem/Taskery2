import express from 'express';

const auth = require("express").Router();

import createUser from '../src/controllers/registerController';
import loginUser from '../src/controllers/loginController';
import logoutUser from '../src/controllers/logoutController';
import refreshToken from '../src/controllers/refreshTokenController';

auth.get('/', (req: express.Request, res: express.Response) => {
  res.send('AUTH');
});

auth.post('/register', createUser);
auth.post('/login', loginUser);
auth.get('/logout', logoutUser);
auth.get('/refresh', refreshToken);
auth.put('/register', createUser);
auth.put('/login', loginUser);

module.exports = auth;
