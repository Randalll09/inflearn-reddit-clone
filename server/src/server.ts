import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import subRoutes from './routes/subs';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
const origin = 'http://localhost:3000';
app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use(cookieParser());

app.get('/', (_, res) => res.send('running'));

app.use('/api/auth', authRoutes);
app.use('/api/subs', subRoutes);

let port = 4000;

dotenv.config();

app.listen(port, async () => {
  console.log(`Server Running at http://localhost:${port}`);
  AppDataSource.initialize()
    .then(() => {
      console.log('data initialize');
    })
    .catch((error) => console.log(error));
});
