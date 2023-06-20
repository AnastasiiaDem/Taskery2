import express from 'express';
import {
  createProject,
  deleteProject,
  getCurrentProject,
  getProjects,
  updateProject
} from '../controllers/projectController';

const project = require('express').Router();

project.get('/', (req: express.Request, res: express.Response) => {
  res.send('PROJECT');
});

project.get('/all', getProjects);
project.get('/current/:id', getCurrentProject);
project.post('/create', createProject);
project.put('/update/:id', updateProject);
project.delete('/delete/:id', deleteProject);

module.exports = project;
