import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { UpdateTagRequest } from 'src/dto/update-tag-requesr.dto';
import { Validator } from './validator';

const schema = Joi.object({
  name: Joi.string().empty().max(40).optional().messages({
    'string.empty': 'Nickname name us required field',
    'string.max': 'The maximum length of the name is 40',
  }),
  sortOrder: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Select order must be greater than or equal 0',
    'number.unknown': 'Select order must be a number ',
  }),
});

@Injectable()
export class UpdateTagValidationPipe
  extends Validator<UpdateTagRequest>
  implements PipeTransform<UpdateTagRequest>
{
  transform(value: UpdateTagRequest) {
    return this.validate(schema, value);
  }
}
