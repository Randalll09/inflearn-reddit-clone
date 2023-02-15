import { Exclude, Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import { Entity, Index, Column, OneToMany, BeforeInsert } from 'typeorm';
import BaseEntity from './Entity';

import bcrypt from 'bcryptjs';
import Post from './Post';
import Vote from './Vote';

@Entity('users')
export default class User extends BaseEntity {
  @Index()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 22, { message: 'Username must be between 3 to 22 letters' })
  @Column({ unique: true })
  username: string;

  @Index()
  @Column({ nullable: true })
  firstname: string;

  @Index()
  @Column({ nullable: true })
  lastname: string;

  @Exclude()
  @Column()
  @Length(6, 25, { message: 'Password must be between 6 to 25 characters' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  @Expose()
  get name() {
    return this.firstname + ' ' + this.lastname;
  }
}
