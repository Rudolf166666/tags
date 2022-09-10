import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entity/tag.entity';
import { User } from 'src/entity/user.entity';
import { TagDao } from 'src/interface/tag.dao.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class TagDaoImpl implements TagDao {
  constructor(private readonly dataSource: DataSource) {}
  getById(id: string) {
    const repository = this.dataSource.getRepository(Tag);
    return repository.findOne({ relations: ['creator'], where: { id } });
  }
  getByCreatorId(id: string) {
    const repository = this.dataSource.getRepository(Tag);
    return repository
      .createQueryBuilder('tag')
      .select(['tag.id', 'tag.name', 'tag.sortOrder'])
      .where('tag.creator_id = :id', { id })
      .getMany();
  }
  getAllAndCountById(ids: string[]) {
    const repository = this.dataSource.getRepository(Tag);
    return repository
      .createQueryBuilder('tag')
      .where('tag.id IN (:...ids)', { ids: ids })
      .getManyAndCount();
  }
  removeById(id: string) {
    const repository = this.dataSource.getRepository(Tag);
    return repository
      .createQueryBuilder()
      .delete()
      .from(Tag)
      .where('tag.id = :id', { id })
      .execute();
  }
  getByName(name: string): Promise<Tag> {
    const repository = this.dataSource.getRepository(Tag);
    return repository.findOne({ where: { name } });
  }
  createTag(tag: Tag): Promise<Tag> {
    const repository = this.dataSource.getRepository(Tag);
    return repository.save(tag);
  }
  updateTag(tag: Tag): Promise<Tag> {
    const repository = this.dataSource.getRepository(Tag);
    return repository.save(tag);
  }

  async findAll(offset: number, limit: number, sort: string): Promise<any> {
    const sorting = {
      order_asc: { field: 'sort_order', sort: 'ASC' },
      name_asc: { field: 'name', sort: 'ASC' },
      name_desc: { field: 'name', sort: 'DESC' },
      order_desc: { field: 'sort_order', sort: 'DESC' },
    };
    const repository = this.dataSource.getRepository(Tag);
    const data = await repository
      .createQueryBuilder('tag')
      .select(['tag.name', 'tag.sort_order', 'c.id', 'c.nickname'])
      .innerJoinAndSelect(User, 'c', 'tag.creator = c.id')
      .orderBy(sorting[sort].field, sorting[sort].sort)
      .offset((offset - 1) * limit)
      .limit(limit)
      .getRawMany();
    return data.map((el) => ({
      name: el.tag_name,
      sortOrder: el.sort_order,
      creator: { uid: el.c_id, nickname: el.c_nickname },
    }));
  }
  getCount(): Promise<number> {
    const repository = this.dataSource.getRepository(Tag);
    return repository.count();
  }
}
