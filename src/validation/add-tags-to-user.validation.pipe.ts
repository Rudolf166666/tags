import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { AddTagsToUserRequest } from 'src/dto/add-tags-to-user.request.dto';
import { Validator } from './validator';

const schema = Joi.object({
  tags: Joi.array().items(Joi.string().guid()).required(),
});

@Injectable()
export class AddTagsToUserValidationPipe
  extends Validator<AddTagsToUserRequest>
  implements PipeTransform<AddTagsToUserRequest>
{
  transform(value: AddTagsToUserRequest) {
    return this.validate(schema, value);
  }
}
