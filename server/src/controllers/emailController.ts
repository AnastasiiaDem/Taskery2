import express from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = (req: express.Request, res: express.Response) => {
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
      to: 'patriciagarraway8@gmail.com',
      subject: 'Testing Email',
      text: 'Text of testing email',
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




