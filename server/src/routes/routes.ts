import express from 'express';
import createUser from '../controllers/registerController';
import loginUser from '../controllers/loginController';
import refreshToken from '../controllers/refreshTokenController';
import {deleteUser, getAllUsers, getCurrentUser, updateUser} from '../controllers/userController';
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
import {getAItext} from '../controllers/aiController';
import {deleteRequest, getRequests, sendRequest, sendRespond} from '../controllers/contactController';

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
routes.delete('/user/delete/:id', deleteUser);

routes.post('/email', sendEmail);

routes.post('/contact', sendRequest);
routes.get('/getRequests', getRequests);
routes.post('/respond', sendRespond);
routes.delete('/request/delete/:id', deleteRequest);

routes.post('/ai', getAItext);

module.exports = routes;


