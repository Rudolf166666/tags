import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity({ name: 'user_tags' })
export class UserTags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  constructor(user: User, tag: Tag) {
    this.user = user;
    this.tag = tag;
  }
}
