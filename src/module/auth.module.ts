import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';
import { UserDaoImpl } from 'src/dao/user.dao';
import { AuthService } from 'src/service/auth.service';
import { JwtValidationService } from 'src/service/jwt.validation.service';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'jwtConstants.secret',
    }),
  ],
  providers: [
    AuthService,
    { provide: 'UserDao', useClass: UserDaoImpl },
    JwtValidationService,
  ],
  exports: [JwtValidationService],
})
export class AuthModule {}
