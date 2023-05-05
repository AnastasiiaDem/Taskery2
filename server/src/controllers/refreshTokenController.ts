const jwt = require('jsonwebtoken');
import express from 'express';
import User from '../model/UserModel';
import Token from '../model/TokenModel';

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;

const refreshToken = async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  
  if (!cookies?.token) return res.status(401).json({error: 'error no cookies'});
  
  const refreshToken = cookies.token;
  const foundToken = await Token.findOne({refreshToken: refreshToken}).exec();
  const foundUser = await User.findById(foundToken?.userId);
  
  if (!foundUser) return res.status(403).json({error: 'error user not found'});
  
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: Error, data: any) => {
    if (err || foundUser.email !== data.email) return res.status(403).json({error: 'error' + err});
    
    const email = foundUser.email;
    const role = foundUser.role;
    
    const accessToken = jwt.sign(
      {
        UserData: {
          email: foundUser.email,
          role: role,
        },
      },
      ACCESS_TOKEN_SECRET,
      {expiresIn: '15s'}
    );
    
    res.status(200).json({message: 'Refreshed', role, accessToken, email});
  });
};

export default refreshToken;
