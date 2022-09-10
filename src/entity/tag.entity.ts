import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 40, unique: true })
  name: string;

  @Column({ nullable: false, name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  constructor(name: string, creator: User, sortOrder?: number) {
    this.name = name;
    this.creator = creator;
    if (sortOrder) {
      this.sortOrder = sortOrder;
    }
  }
}
