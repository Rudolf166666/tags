import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { CreateTagRequest } from 'src/dto/create-tag.request.dto';
import { Validator } from './validator';

const schema = Joi.object({
  name: Joi.string().empty().max(40).required().messages({
    'string.empty': 'Nickname name us required field',
    'string.required': 'Nickname name us required field',
    'string.max': 'The maximum length of the name is 40',
  }),
  sortOrder: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Select order must be greater than or equal 0',
    'number.unknown': 'Select order must be a number ',
  }),
});

@Injectable()
export class CreateTagValidationPipe
  extends Validator<CreateTagRequest>
  implements PipeTransform<CreateTagRequest>
{
  transform(value: CreateTagRequest) {
    return this.validate(schema, value);
  }
}
