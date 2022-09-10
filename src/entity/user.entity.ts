import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 30, unique: true })
  nickname: string;

  @Column({ nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ nullable: false, length: 100 })
  password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
