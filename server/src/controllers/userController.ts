import express from 'express';
import User from '../model/UserModel';
import Token from '../model/TokenModel';

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

