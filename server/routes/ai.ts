import express from 'express';
import {getAIBudget, getAIProject, getAITask} from '../src/controllers/aiController';

const ai = require("express").Router();

ai.get('/', (req: express.Request, res: express.Response) => {
  res.send('AI');
});

ai.post('/project', getAIProject);
ai.post('/budget', getAIBudget);
ai.post('/task', getAITask);

module.exports = ai;
