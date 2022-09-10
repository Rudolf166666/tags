import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entity/tag.entity';
import { User } from 'src/entity/user.entity';
import { UserTags } from 'src/entity/user.tag.entity';
import { UserTagDao } from 'src/interface/user-tag.dao.interface';
import { DataSource, DeleteResult } from 'typeorm';

@Injectable()
export class UserTagDaoImpl implements UserTagDao {
  constructor(private readonly dataSource: DataSource) {}

  removeByTagAndUser(tagId: string, userId: string): Promise<DeleteResult> {
    const repository = this.dataSource.getRepository(UserTags);
    return repository
      .createQueryBuilder('user_tag')
      .delete()
      .from(UserTags)
      .where('user_id = :id', { id: userId })
      .andWhere('tag_id = :id', { id: tagId })
      .execute();
  }
  getByTagAndUser(tagIds: string[], user: User) {
    const repository = this.dataSource.getRepository(UserTags);
    return repository
      .createQueryBuilder('ut')
      .innerJoinAndSelect('ut.tag', 't')
      .where('tag_id IN (:...tagIds)', { tagIds })
      .andWhere('user_id = :id', { id: user.id })
      .getMany();
  }
  async addTagsToUser(user: User, tags: Tag[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const repository = this.dataSource.getRepository(UserTags);
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        tags.map((tag) => repository.save(new UserTags(user, tag))),
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  addTagToUser(user: User, tag: Tag): Promise<UserTags> {
    const repository = this.dataSource.getRepository(UserTags);
    return repository.save(new UserTags(user, tag));
  }
}
