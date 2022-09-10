import { Module } from '@nestjs/common';
import { TagController } from 'src/controller/tag.controller';
import { TagDaoImpl } from 'src/dao/tag.dao';
import { UserTagDaoImpl } from 'src/dao/user-tag.dao';
import { UserDaoImpl } from 'src/dao/user.dao';
import { TagService } from 'src/service/tag.service';

@Module({
  controllers: [TagController],
  imports: [],
  providers: [
    TagService,
    { provide: 'UserDao', useClass: UserDaoImpl },
    { provide: 'TagDao', useClass: TagDaoImpl },
    { provide: 'UserTagDao', useClass: UserTagDaoImpl },
  ],
  exports: [],
})
export class TagModule {}
