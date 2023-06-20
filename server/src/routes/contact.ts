import express from 'express';
import {deleteRequest, getRequests, sendRequest, sendRespond} from '../controllers/contactController';

const contact = require('express').Router();

contact.get('/', (req: express.Request, res: express.Response) => {
  res.send('contact');
});

contact.post('/request', sendRequest);
contact.post('/respond', sendRespond);
contact.get('/getRequests', getRequests);
contact.delete('/request/delete/:id', deleteRequest);

module.exports = contact;
