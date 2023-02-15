import jwt from 'jsonwebtoken';
import User from '../entities/User';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return next();

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneBy({ username });
    console.log('user', user);
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error in User Middleware' });
  }
};
