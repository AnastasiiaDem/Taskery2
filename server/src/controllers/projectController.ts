import User from '../model/UserModel';
import Token from '../model/TokenModel';
import express from 'express';
import Project from '../model/ProjectModel';
import mongoose from 'mongoose';

export const createProject = async (req: express.Request, res: express.Response) => {
  const {projectName, description, status, assignedUsers, createdAt} = req.body;
  
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  if (!projectName || !description || !status || !createdAt)
    return res.status(400).json({message: `Properties are required`});
  
  const id = new mongoose.Types.ObjectId();
  
  const newProject = new Project({
    _id: id,
    userId: foundUser._id,
    projectName: projectName,
    description: description,
    status: status,
    assignedUsers: assignedUsers,
    createdAt: createdAt
  });
  
  newProject.save((err, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
};

export const updateProject = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  
  !id && res.status(400).json({error: 'no id'});
  
  const {projectName, description, status, assignedUsers, createdAt} = req.body;
  
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  if (!projectName || !description || !status || !createdAt)
    return res.status(400).json({message: `Properties are required`});
  
  const update = {
    ...(projectName ? {projectName: projectName} : {}),
    ...(description ? {description: description} : {}),
    ...(status ? {status: status} : {}),
    ...(assignedUsers ? {assignedUsers: assignedUsers} : {}),
    ...(createdAt ? {createdAt: createdAt} : {}),
  };
  
  try {
    const result = await Project.findByIdAndUpdate(id, update, {new: true});
    
    res.status(200).json({message: 'Project is updated'});
  } catch (error: any) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

export const deleteProject = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  
  !id && res.status(400).json({error: 'no id'});
  
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  try {
    const result = await Project.findByIdAndDelete(id);
    res.status(200).json({message: 'Project is deleted'});
  } catch (error: any) {
    res.status(400).json({error: error});
  }
};

export const getProjects = async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  try {
    const projects = await Project.find({});
    
    if (projects.length == 0) return res.status(400).json({message: 'No content'});
    
    res.status(200).json({projects: projects});
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

export const getCurrentProject = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  
  !id && res.status(400).json({error: 'no id'});
  
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  try {
    const project = await Project.findById(id);
    if (!project) return res.status(400).json({message: 'No content'});
    
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error});
  }
};

