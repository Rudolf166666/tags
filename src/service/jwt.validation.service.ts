import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { UserDao } from 'src/interface/user.dao.interface';

@Injectable()
export class JwtValidationService {
  constructor(
    @Inject('UserDao') private readonly userDao: UserDao,
    private readonly jwtService: JwtService,
  ) {}

  public validateToken(token: string): boolean {
    try {
      const isValid: { id: number; email: string } =
        this.jwtService.verify(token);
      return !!isValid;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public getUserByToken(token: string): Promise<User> {
    const claims: { id: number; email: string } = this.jwtService.verify(token);
    return this.userDao.getByEmail(claims.email);
  }
}
