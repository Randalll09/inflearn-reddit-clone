import { NextFunction, Response, Request } from 'express';
import User from '../entities/User';

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error('unauthenticated');
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Error in auth middleware' });
  }
};
