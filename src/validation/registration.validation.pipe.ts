import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { RegistrationReqDto } from 'src/dto/registration.request.dto';
import { Validator } from './validator';

const schema = Joi.object({
  email: Joi.string().email().empty().required().messages({
    'string.email': 'Must be email',
    'string.empty': 'Email us required field',
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .empty()
    .required()
    .messages({
      'string.pattern.base':
        'The password must be at least 8 characters , have one digit , one uppercase and one lowercase letter',
      'string.empty': 'Password us required field',
    }),
  nickname: Joi.string().empty().required().messages({
    'string.empty': 'Nickname name us required field',
  }),
});

@Injectable()
export class RegistrationValidationPipe
  extends Validator<RegistrationReqDto>
  implements PipeTransform<RegistrationReqDto>
{
  transform(value: RegistrationReqDto) {
    return this.validate(schema, value);
  }
}
