import { Tag } from 'src/entity/tag.entity';
import { User } from 'src/entity/user.entity';
import { UserTags } from 'src/entity/user.tag.entity';
import { DeleteResult } from 'typeorm';

export interface UserTagDao {
  getByTagAndUser(tag: string[], user: User): Promise<UserTags[]>;
  removeByTagAndUser(tagId: string, userId: string): Promise<DeleteResult>;
  addTagsToUser(user: User, tags: Tag[]): Promise<void>;
  addTagToUser(user: User, tag: Tag): Promise<UserTags>;
}
