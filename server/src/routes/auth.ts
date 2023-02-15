import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../entities/User';
import { mapError } from '../utils/helper';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser) errors.email = 'email already using';
    if (usernameUser) errors.username = 'username already using';

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    errors = await validate(user);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(mapError(errors));
    }
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = 'Please write a username';
    if (isEmpty(password)) errors.username = 'Please write a password';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = await User.findOneBy({ username });
    if (!user)
      return res.status(404).json({ username: "Username doesn't exist" });

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ password: 'Wrong password' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const router = Router();
router.get('/me', userMiddleware, authMiddleware, me);
router.post('/register', register);
router.post('/login', login);

export default router;
