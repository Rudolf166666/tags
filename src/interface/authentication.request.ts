import { Request } from 'express';
import { User } from 'src/entity/user.entity';

export interface AuthenticationRequest extends Request {
  user?: User;
}
