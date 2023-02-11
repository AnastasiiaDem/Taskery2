import express from 'express';
import createUser from '../controllers/registerController';
import loginUser from '../controllers/loginController';
import refreshToken from '../controllers/refreshTokenController';
import {getAllUsers, getCurrentUser, updateUser} from '../controllers/userController';
import logoutUser from '../controllers/logoutController';
import {
  createProject,
  deleteProject,
  getCurrentProject,
  getProjects,
  updateProject
} from '../controllers/projectController';
import {createTask, deleteTask, getTasks, updateTask} from '../controllers/taskController';
import {sendEmail} from '../controllers/emailController';

require('dotenv').config();

const routes = require('express').Router();

routes.get('/', (req: express.Request, res: express.Response) => {
  res.send('Test endpoint');
});

routes.post('/register', createUser);
routes.post('/login', loginUser);
routes.get('/logout', logoutUser);
routes.get('/refresh', refreshToken);

routes.get('/projects', getProjects);
routes.get('/project/current/:id', getCurrentProject);
routes.post('/project/create', createProject);
routes.put('/project/update/:id', updateProject);
routes.delete('/project/delete/:id', deleteProject);

routes.get('/tasks', getTasks);
routes.post('/task/create', createTask);
routes.put('/task/update/:id', updateTask);
routes.delete('/task/delete/:id', deleteTask);

routes.get('/users', getAllUsers);
routes.get('/user/current', getCurrentUser);
routes.put('/user/update', updateUser);

routes.post('/email', sendEmail);

module.exports = routes;


