import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { UpdateUserRequest } from 'src/dto/update.user.request';
import { Validator } from './validator';

const schema = Joi.object({
  email: Joi.string().email().empty().optional().messages({
    'string.email': 'Must be email',
    'string.empty': 'Email us must not be empty field',
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .empty()
    .optional()
    .messages({
      'string.pattern.base':
        'The password must be at least 8 characters , have one digit , one uppercase and one lowercase letter',
      'string.empty': 'Password us must not be empty field',
    }),
  nickname: Joi.string().empty().optional().messages({
    'string.empty': 'Nickname name us required field',
  }),
});

@Injectable()
export class UpdateUserValidationPipe
  extends Validator<UpdateUserRequest>
  implements PipeTransform<UpdateUserRequest>
{
  transform(value: UpdateUserRequest) {
    return this.validate(schema, value);
  }
}
