import express from 'express';
import User from '../model/UserModel';
import Token from '../model/TokenModel';
import Task from '../model/TaskModel';
import {Schema} from 'mongoose';

export const getAllUsers = (req: express.Request, res: express.Response) => {
  User.find({}, function (err: Error, data: any) {
    
    if (data.length === 0 || err) return res.status(400).json({message: 'There is no any user'});
    
    return res.status(200).json(data);
  });
};


export const getCurrentUser = async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  return res.status(200).json(foundUser);
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  const {_id, firstName, lastName, email, password, role} = req.body;
  
  const cookies = req.cookies;

  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  if (!_id || !firstName || !lastName || !email || !password || !role)
    return res.status(400).json({message: `Properties are required`});
  
  const update = {
    ...(firstName ? {firstName: firstName} : {}),
    ...(lastName ? {lastName: lastName} : {}),
    ...(email ? {email: email} : {}),
    ...(password ? {password: password} : {}),
    ...(role ? {role: role} : {}),
  };
  
  try {
    const result = await User.findByIdAndUpdate(_id, update, {new: true});
    
    res.status(200).json({message: 'User is updated'});
  } catch (error: any) {
    console.log(error);
    res.status(400).json({error: error});
  }
};
