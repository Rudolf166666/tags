import { User } from 'src/entity/user.entity';
import { DeleteResult } from 'typeorm';

export interface UserDao {
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByEmailOrNickname(email: string, nickname: string): Promise<User>;
  createUser(email: string, password: string, nickname: string): Promise<User>;
  removeUserById(id: string): Promise<DeleteResult>;
  updateUser(user: User): Promise<User>;
  getUserWithTags(user: User): Promise<any>;
}
