import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { AuthModule } from './auth.module';
import { TagModule } from './tag.module';
import { TypeOrmModule } from './typeorm.module';
import { UserModule } from './user.module';

@Module({
  imports: [AuthModule, TypeOrmModule, UserModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/login', '/signin').forRoutes('*');
  }
}
