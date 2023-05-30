import User from '../model/UserModel';
import Token from '../model/TokenModel';
import express from 'express';
import Task from '../model/TaskModel';
import mongoose from 'mongoose';
//додавання завдань в бд
export const createTask = async (req: express.Request, res: express.Response) => {
  const {employeeId, projectId, title, description, status, deadline} = req.body;
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  if (!title || !description || !status || !deadline)
    return res.status(400).json({message: `Properties are required`});
  
  const id = new mongoose.Types.ObjectId();
  const newTask = new Task({
    _id: id,
    employeeId: employeeId,
    projectId: projectId,
    title: title,
    description: description,
    status: status,
    deadline: deadline
  });
  newTask.save((err, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
};
//оновлення завдань в бд
export const updateTask = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  !id && res.status(400).json({error: 'no id'});
  
  const {title, description, status, deadline, employeeId} = req.body;
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  if (!title || !description || !status || !deadline)
    return res.status(400).json({message: `Properties are required`});
  
  const update = {
    ...(title ? {title: title} : {}),
    ...(description ? {description: description} : {}),
    ...(status ? {status: status} : {}),
    ...(deadline ? {deadline: deadline} : {}),
    ...(employeeId ? {employeeId: employeeId} : {}),
  };
  try {
    const result = await Task.findByIdAndUpdate(id, update, {new: true});
    res.status(200).json({message: 'Task is updated'});
  } catch (error: any) {
    console.log(error);
    res.status(400).json({error: error});
  }
};
//видалення завдань з бд
export const deleteTask = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  !id && res.status(400).json({error: 'no id'});
  
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  try {
    const result = await Task.findByIdAndDelete(id);
    res.status(200).json({message: 'Task is deleted'});
  } catch (error: any) {
    res.status(400).json({error: error});
  }
};
//отримання списку усіх завдань з бд
export const getTasks = async (req: express.Request, res: express.Response) => {
  const {title, description, status, deadline} = req.query;
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  try {
    const tasks = await Task.find({
      $and: [
        {...(title ? {title: title} : {})},
        {...(description ? {description: description} : {})},
        {...(status ? {status: status} : {})},
        {...(deadline ? {deadline: deadline} : {})}
      ],
    });
    if (tasks.length == 0) return res.status(400).json({message: 'No content'});
    res.status(200).json({tasks: tasks});
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

