import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import { isEmpty } from 'class-validator';
import Sub from '../entities/Sub';
import { AppDataSource } from '../data-source';

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'Please fillout the name';
    if (isEmpty(title)) errors.title = 'Please fillout the title';

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name)=:name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = 'This name already exists';
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
  try {
    const user: User = res.locals.user;

    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();

    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();

router.post('/', userMiddleware, authMiddleware, createSub);

export default router;
