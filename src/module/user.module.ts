import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { TagDaoImpl } from 'src/dao/tag.dao';
import { UserTagDaoImpl } from 'src/dao/user-tag.dao';
import { UserDaoImpl } from 'src/dao/user.dao';
import { UserService } from 'src/service/user.service';

@Module({
  controllers: [UserController],
  imports: [],
  providers: [
    UserService,
    { provide: 'UserDao', useClass: UserDaoImpl },
    { provide: 'TagDao', useClass: TagDaoImpl },
    { provide: 'UserTagDao', useClass: UserTagDaoImpl },
  ],
  exports: [],
})
export class UserModule {}
