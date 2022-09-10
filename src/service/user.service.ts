import { Inject, Injectable } from '@nestjs/common';
import { ApiException } from 'src/exception/api.exception';
import { UserDao } from 'src/interface/user.dao.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { TagDao } from 'src/interface/tag.dao.interface';
import { UserTagDao } from 'src/interface/user-tag.dao.interface';
import { Tag } from 'src/entity/tag.entity';
import { UpdateUserRequest } from 'src/dto/update.user.request';
@Injectable()
export class UserService {
  constructor(
    @Inject('UserDao') private readonly userDao: UserDao,
    @Inject('TagDao') private readonly tagDao: TagDao,
    @Inject('UserTagDao') private readonly userTagDao: UserTagDao,
  ) {}
  async checkIsOccupiedData(email: string, nickname: string): Promise<void> {
    const isExist = await this.userDao.getByEmailOrNickname(email, nickname);
    if (isExist)
      throw ApiException.badRequest(
        'User with this email or nickname already exist',
      );
  }

  getUserById(user: User) {
    return this.userDao.getById(user.id);
  }
  async getUserWithTags(user: User) {
    return await this.userDao.getUserWithTags(user);
  }
  async getTagsCreatedByUser(user: User) {
    const tags = await this.tagDao.getByCreatorId(user.id);
    return { tags };
  }
  async updateUserInfo(data: UpdateUserRequest, user: User) {
    await this.checkIsOccupiedData(data.email, data.nickname);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await this.userDao.updateUser({
      ...user,
      ...data,
    });
    delete updatedUser.id;
    delete updatedUser.password;

    return updatedUser;
  }

  removeUser(user: User) {
    return this.userDao.removeUserById(user.id);
  }
  removeUserTag(user: User, tagId: string) {
    return this.userTagDao.removeByTagAndUser(tagId, user.id);
  }

  async addTagsToUser(user: User, tagsIds: string[]) {
    const [tags]: [Tag[], unknown] = await this.tagDao.getAllAndCountById(
      tagsIds,
    );
    const unExistingTag = tagsIds.find(
      (el) => !tags.map((el) => el.id).includes(el),
    );
    if (unExistingTag) {
      throw ApiException.badRequest(
        `Tag with id : ${unExistingTag} does not exist`,
      );
    }
    const userTags = await this.userTagDao.getByTagAndUser(tagsIds, user);
    await this.userTagDao.addTagsToUser(
      user,
      tags.filter((el) => !userTags.map((ut) => ut.tag.id).includes(el.id)),
    );
    return { tags };
  }
}
