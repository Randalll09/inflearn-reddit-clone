import 'reflect-metadata';
import { DataSource } from 'typeorm';
// import { User } from './entities/User';
import User from './entities/User';
import Post from './entities/Post';
import Sub from './entities/Sub';
import Comment from './entities/Comment';
import Vote from './entities/Vote';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  synchronize: true,
  logging: false,
  // entities: ['src/entities/**/*.ts'],
  entities: [User, Post, Sub, Comment, Vote],
  migrations: [],
  subscribers: [],
});
