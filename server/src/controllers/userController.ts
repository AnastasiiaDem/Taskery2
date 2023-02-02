import express from "express";
import User from "../model/UserModel";

const getAllUsers = (req: express.Request, res: express.Response) => {
  User.find({}, function (err: Error, data: any) {
    
    if (data.length === 0 || err) return res.status(400).json({ message: "There is no any user" });

    return res.status(200).json(data);
  });
};

export default getAllUsers;
