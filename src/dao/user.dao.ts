import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entity/tag.entity';
import { User } from 'src/entity/user.entity';
import { UserTags } from 'src/entity/user.tag.entity';
import { UserDao } from 'src/interface/user.dao.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class UserDaoImpl implements UserDao {
  constructor(private readonly dataSource: DataSource) {}

  async getByEmail(email: string) {
    const repository = this.dataSource.getRepository(User);
    return repository.findOneBy({ email });
  }
  getById(id: string) {
    const repository = this.dataSource.getRepository(User);
    return repository.findOneBy({ id });
  }
  getByEmailOrNickname(email: string, nickname: string) {
    const repository = this.dataSource.getRepository(User);
    return repository
      .createQueryBuilder()
      .where('email = :email OR nickname = :nickname', {
        email,
        nickname,
      })
      .getOne();
  }
  createUser(email: string, password: string, nickname: string): Promise<User> {
    const repository = this.dataSource.getRepository(User);
    return repository.save(new User(email, nickname, password));
  }
  removeUserById(id: string) {
    const repository = this.dataSource.getRepository(User);
    return repository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: id })
      .execute();
  }
  updateUser(user: User): Promise<User> {
    const repository = this.dataSource.getRepository(User);
    return repository.save(user);
  }

  async getUserWithTags(user: User) {
    const repository = this.dataSource.getRepository(User);
    const { raw, entities } = await repository
      .createQueryBuilder('u')
      .leftJoinAndSelect(UserTags, 'ut', 'ut.user = u.id')
      .leftJoinAndMapMany('ut.tag', Tag, 'tag', 'tag.id = ut.tag')
      .where('u.id = :id', { id: user.id })
      .getRawAndEntities();

    return {
      email: entities[0].email,
      nickname: entities[0].nickname,
      tags: raw
        .filter((el) => el.tag_id)
        .map((el) => ({
          id: el.tag_id,
          name: el.tag_name,
          sortOrder: el.tag_order,
        })),
    };
  }
}
