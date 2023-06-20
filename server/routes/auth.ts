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

auth.put('/login', (req: any, res: { redirect: (arg0: number, arg1: string) => void; }, next: any) => {
  res.redirect(303, '/login')
});

module.exports = auth;
