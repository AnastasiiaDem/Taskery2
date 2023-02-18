import express from 'express';
import nodemailer from 'nodemailer';
import User from '../model/UserModel';

export const sendEmail = async (req: express.Request, res: express.Response) => {
  const {userId, project, task, report, content} = req.body;
  
  if (!userId || !project) return res.status(400).json({message: `Incorrect password or email`});
  
  const foundUser = await User.findOne({_id: userId}).exec();
  
  let assignedList = '';
  let fullUserData: any = {};
  for (const u of project.assignedUsers) {
    fullUserData = await User.findOne({_id: u.id}).exec();
    assignedList += `${fullUserData.firstName} ${fullUserData.lastName} (${fullUserData.email})<br>`;
  }
  
  if (!foundUser) return res.status(409).json({message: `Incorrect password or email`});
  
  let html = '';
  let subject = '';
  
  if (content == 'project') {
    html = '<style>' +
      '.email-text {display: flex; align-items: flex-start; justify-content: flex-start;flex-direction: column; width: 500px;}' +
      '</style>' +
      '    <div class="email-text" style="font-size: 15px;"> \n' +
      '    <p>Hi, <b style="font-size: 20px;">' + foundUser.firstName + ' ' + foundUser.lastName + '</b></p>\n' +
      '    <p style="font-style: italic; text-align: center;">You have been assigned to a project on the <b style="color: rgb(76 126 253) !important;">Taskery.com</b> website</p>\n' +
      '    <p>Project name: <b>' + project.projectName + '</b></p>\n' +
      '    <p style="text-align: left;">Project description: <br><p style="margin-left: 50px;">' + project.description + '</p></p>\n' +
      '    <p>Project status: <b>' + project.status + '</b></p>\n' +
      '    <p>All assigned employees for this project: <p style="margin-left: 50px;">' + assignedList + '</p></p>\n' +
      '  </div>';
    
    subject = 'New Project // Taskery.com';
    
  } else if (content == 'task') {
    html = '<style>' +
      '.email-text {display: flex; align-items: flex-start; justify-content: flex-start;flex-direction: column; width: 500px;}' +
      '</style>' +
      '    <div class="email-text" style="font-size: 15px;"> \n' +
      '    <p>Hi, <b style="font-size: 20px;">' + foundUser.firstName + ' ' + foundUser.lastName + '</b></p>\n' +
      '    <p style="font-style: italic; text-align: center;">You have new task on the <b style="color: rgb(76 126 253) !important;">Taskery.com</b> website</p>\n' +
      '    <p>Project name: <b>' + project.projectName + '</b></p>\n' +
      '    <p>Task name: <b>' + task.title + '</b></p>\n' +
      '    <p style="text-align: left;">Task description: <br><p style="margin-left: 50px;">' + task.description + '</p></p>\n' +
      '    <p>Task deadline: <b>' + task.deadline + '</b></p>\n' +
      '  </div>';
    
    subject = 'New Task // Taskery.com';
    
  } else if (content == 'taskUpdate') {
    html = '<style>' +
      '.email-text {display: flex; align-items: flex-start; justify-content: flex-start;flex-direction: column; width: 500px;}' +
      '</style>' +
      '    <div class="email-text" style="font-size: 15px;"> \n' +
      '    <p>Hi, <b style="font-size: 20px;">' + foundUser.firstName + ' ' + foundUser.lastName + '</b></p>\n' +
      '    <p style="font-style: italic; text-align: center;">Your task was updated on the <b style="color: rgb(76 126 253) !important;">Taskery.com</b> website</p>\n' +
      '    <p>Project name: <b>' + project.projectName + '</b></p>\n' +
      '    <p>Task name: <b>' + task.title + '</b></p>\n' +
      '    <p style="text-align: left;">Task description: <br><p style="margin-left: 50px;">' + task.description + '</p></p>\n' +
      '    <p>Task deadline: <b>' + task.deadline + '</b></p>\n' +
      '  </div>';
    
    subject = 'Task Update // Taskery.com';
    
  } else if (content == 'report') {
    html = '<style>' +
      '.email-text {display: flex; align-items: flex-start; justify-content: flex-start;flex-direction: column; width: 500px;}' +
      '</style>' +
      '    <div class="email-text" style="font-size: 15px;"> \n' +
      '    <p>Hi, <b style="font-size: 20px;">' + foundUser.firstName + ' ' + foundUser.lastName + '</b></p>\n' +
      '    <p style="font-style: italic; text-align: center;">Here is the report to a project on the <b style="color: rgb(76 126 253) !important;">Taskery.com</b> website</p>\n' +
      '    <p>Project name: <b>' + project.projectName + '</b></p>\n' +
      '    <p>Project status: <b>' + report.status + '</b></p>\n' +
      '    <p>Project start Date: <b>' + report.projectStart + '</b></p>\n' +
      '    <p>Number of tasks: <b>' + report.numberOfTasks + '</b></p>\n' +
      '    <p>Number of overdue tasks: <b>' + report.overdueTasks + '</b></p>\n' +
      '  </div>';
    
    subject = 'Report // Taskery.com';
  }
  
  
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
      subject: subject,
      html: html,
      
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




