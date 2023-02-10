// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

import { Exclude } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import {
  Entity,
  BaseEntity,
  Index,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

import bcrypt from 'bcryptjs';

// @Entity()
// export class User {

//     @PrimaryGeneratedColumn()
//     id: number

//     @Column()
//     firstName: string

//     @Column()
//     lastName: string

//     @Column()
//     age: number

// }
@Entity('users')
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: 'Not a email form' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 22, { message: 'Username must be between 3 to 22 letters' })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 25, { message: 'Password must be between 6 to 25 characters' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
