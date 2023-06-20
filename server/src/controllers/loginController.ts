const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import express from 'express';
import process from 'process';
import User from '../model/UserModel';
import Token from '../model/TokenModel';

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;

const loginUser = async (req: express.Request, res: express.Response) => {
  const {email, password} = req.body;
  
  if (!email || !password) return res.status(400).json({
    message: {
      messageEn: `Incorrect password or email`,
      messageUa: `Пароль чи електронна пошта є неправильними`
    }
  });
  
  const foundUser = await User.findOne({email: email}).exec();
  
  
  if (!foundUser) return res.status(409).json({ message: {
      messageEn: `Incorrect password or email`,
      messageUa: `Пароль чи електронна пошта є неправильними`
    }});
  
  // const validPassword = await bcrypt.compare(password, foundUser.password);
  
  if (password == foundUser.password) {
    const role = foundUser.role;
    
    const accessToken = jwt.sign(
      {
        UserData: {
          email: foundUser.email,
          role: role,
        },
      },
      'access',
      {expiresIn: '15s'}
    );
    
    const refreshToken = jwt.sign(
      {
        email: foundUser.email,
      },
      "refresh",
      {expiresIn: '1d'}
    );
    
    Token.findOne({userId: foundUser._id}, function (err: Error, token: any) {
      if (err) return res.status(400).json({error: err});
      
      if (token) {
        token.refreshToken = refreshToken;
        token.requestedTime = Date.now();
        token.save((err: Error) => {
          if (err) return res.status(400).json({error: err});
        });
      }
    });
    
    res.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({message: 'Authorized', accessToken, refreshToken, foundUser});
  } else {
    res.status(400).json({message: `Incorrect password or email`});
  }
};

export default loginUser;
