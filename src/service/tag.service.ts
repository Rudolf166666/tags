import { Inject, Injectable } from '@nestjs/common';
import { ApiException } from 'src/exception/api.exception';
import { UserDao } from 'src/interface/user.dao.interface';
import { User } from 'src/entity/user.entity';
import { TagDao } from 'src/interface/tag.dao.interface';
import { UserTagDao } from 'src/interface/user-tag.dao.interface';
import { Tag } from 'src/entity/tag.entity';
import { CreateTagRequest } from 'src/dto/create-tag.request.dto';
import { UpdateTagRequest } from 'src/dto/update-tag-requesr.dto';
@Injectable()
export class TagService {
  constructor(
    @Inject('UserDao') private readonly userDao: UserDao,
    @Inject('TagDao') private readonly tagDao: TagDao,
    @Inject('UserTagDao') private readonly userTagDao: UserTagDao,
  ) {}

  private async checkIsTagCreator(user: User, tagId: string) {
    const tag = await this.tagDao.getById(tagId);
    if (tag.creator.id !== user.id) {
      throw ApiException.notAllowed(
        'Only the tag creator can manipulate with it',
      );
    }
    return tag;
  }
  private async checkIsExistingName(name: string) {
    const isExist = await this.tagDao.getByName(name);
    if (isExist)
      throw ApiException.badRequest('Tag with same name already exist');
  }
  async removeTag(user: User, id: string) {
    await this.checkIsTagCreator(user, id);
    return this.tagDao.removeById(id);
  }
  getTag(id: string) {
    return this.tagDao.getById(id);
  }
  async getTags(page: number, pageSize: number, sort: string) {
    const [data, quantity] = await Promise.all([
      this.tagDao.findAll(page, pageSize, sort),
      this.tagDao.getCount(),
    ]);

    return {
      data,
      metadata: { offset: page, length: pageSize, quantity },
    };
  }
  async updateTag(user: User, data: UpdateTagRequest, id: string) {
    if (data.name) await this.checkIsExistingName(data.name);
    const tag = await this.checkIsTagCreator(user, id);
    return this.tagDao.updateTag({
      ...tag,
      ...data,
    });
  }

  async createTag(user: User, data: CreateTagRequest) {
    await this.checkIsExistingName(data.name);
    const tag = await this.tagDao.createTag(
      new Tag(data.name, user, data.sortOrder),
    );
    await this.userTagDao.addTagToUser(user, tag);
    delete tag.creator;
    return tag;
  }
}
