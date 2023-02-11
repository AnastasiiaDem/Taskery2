import express from 'express';
import nodemailer from 'nodemailer';
import User from '../model/UserModel';

export const sendEmail = async (req: express.Request, res: express.Response) => {
  const {userId, text} = req.body;
  
  if (!userId || !text) return res.status(400).json({message: `Incorrect password or email`});
  
  const foundUser = await User.findOne({_id: userId}).exec();
  
  
  if (!foundUser) return res.status(409).json({message: `Incorrect password or email`});
  
  
  return new Promise<any>((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
      }
    });
    const mail_config = {
      from: process.env.USER,
      to: foundUser.email,
      subject: 'Taskery.com',
      text: text,
      html: '',
      // attachments: [
      //   { filename: 'greetings.txt', path: '/assets/files/' },
      //   {
      //     filename: 'greetings.txt',
      //     content: 'Message from file.',
      //   },
      //   { path: 'data:text/plain;base64,QmFzZTY0IG1lc3NhZ2U=' },
      //   {
      //     raw: `
      //     Content-Type: text/plain
      //     Content-Disposition: attachment;
      //
      //     Message from file.
      //   `,
      //   },
      // ],
    };
    // @ts-ignore
    transporter.sendMail(mail_config, (err: Error, data: any) => {
      if (err) {
        return res.status(400).json({message: 'An error has occurred'});
      }
      return res.status(200).json({message: 'Email sent successfully'});
    });
  });
};




