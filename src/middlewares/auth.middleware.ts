import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ApiException } from 'src/exception/api.exception';
import { AuthenticationRequest } from 'src/interface/authentication.request';
import { JwtValidationService } from 'src/service/jwt.validation.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtFilterService: JwtValidationService) {}
  async use(req: AuthenticationRequest, res: Response, next: NextFunction) {
    const token = (req.headers.authorization ?? '').replace('Bearer ', '');
    const isValid = this.jwtFilterService.validateToken(token);
    if (!isValid) throw ApiException.unauthorized('Access token is expired');
    const user = await this.jwtFilterService.getUserByToken(token);
    req.user = user;
    next();
  }
}
