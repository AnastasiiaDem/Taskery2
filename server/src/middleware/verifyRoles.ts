import express, {NextFunction} from 'express';

const verifyRoles = (roleType: any) => {
  return (req: any, res: express.Response, next: NextFunction) => {
    if (!req?.role) return res.status(401).json({error: 'Error. No roles'});
    
    if (!(req.role == roleType)) return res.status(401).json({error: 'error'});
    
    next();
  };
};

export default verifyRoles;
