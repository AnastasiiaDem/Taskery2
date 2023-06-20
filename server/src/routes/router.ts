const router = require('express').Router();
const auth = require('./auth');
const project = require('./project');
const task = require('./task');
const user = require('./user');
const contact = require('./contact');
const ai = require('./ai');

import express from 'express';
import {sendEmail} from '../controllers/emailController';


router.get('/', (req: express.Request, res: express.Response) => {
  res.send('Test endpoint');
});

router.use('/auth/', auth);
router.use('/project/', project);
router.use('/task/', task);
router.use('/user/', user);
router.use('/contact/', contact);
router.use('/ai/', ai);

router.post('/email', sendEmail);

module.exports = router;


