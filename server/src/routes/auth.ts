import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import User from '../entities/User';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser) errors.email = 'email already using';
    if (usernameUser) errors.username = 'username already using';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    errors = await validate(user);

    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post('/register', register);

export default router;
