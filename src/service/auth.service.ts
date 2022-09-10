import { Inject, Injectable } from '@nestjs/common';
import { ApiException } from 'src/exception/api.exception';
import { UserDao } from 'src/interface/user.dao.interface';
import { JwtValidationService } from './jwt.validation.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegistrationResDto } from 'src/dto/registration.response';
import { LoginResDto } from 'src/dto/login.response.dto';
import { RefreshResDto } from 'src/dto/refresh.response.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('UserDao') private readonly userDao: UserDao,
    private readonly jwtService: JwtService,
    private readonly jwtValidationService: JwtValidationService,
  ) {}
  async checkIsOccupiedData(email: string, nickname: string): Promise<void> {
    const isExist = await this.userDao.getByEmailOrNickname(email, nickname);
    if (isExist)
      throw ApiException.badRequest(
        'User with this email or nickname already exist',
      );
  }

  private async comparePasswords(
    rawPassword: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(rawPassword, hash);
  }

  private generateToken(user: User, expiresIn: string | number): string {
    return this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn },
    );
  }
  async registration(email: string, password: string, nickname: string) {
    await this.checkIsOccupiedData(email, nickname);
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userDao.createUser(email, hash, nickname);
    const token = this.generateToken(user, 1800);
    return new RegistrationResDto(token, 1800);
  }
  async login(email: string, password: string): Promise<LoginResDto> {
    const user = await this.userDao.getByEmail(email);
    if (!user) throw ApiException.badRequest('Invalid credentials');
    const isMatch = await this.comparePasswords(password, user.password);
    if (!isMatch) throw ApiException.badRequest('Invalid credentials');
    const token = this.generateToken(user, 1800);
    return new LoginResDto(token, 1800);
  }
  async refresh(user: User) {
    const token = this.generateToken(user, 1800);
    return new RefreshResDto(token, 1800);
  }
}
