import { Tag } from 'src/entity/tag.entity';
import { DeleteResult } from 'typeorm';

export interface TagDao {
  getById(id: string): Promise<Tag>;
  getByCreatorId(id: string): Promise<Tag[]>;
  getAllAndCountById(ids: string[]): Promise<[Tag[], number]>;
  removeById(id: string): Promise<DeleteResult>;
  getByName(name: string): Promise<Tag>;
  createTag(tag: Tag): Promise<Tag>;
  updateTag(tag: Tag): Promise<Tag>;
  findAll(offset: number, limit: number, sort: string): Promise<any>;
  getCount(): Promise<number>;
}
