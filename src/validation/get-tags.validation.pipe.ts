import { PipeTransform, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { GetTagsRequest } from 'src/dto/get-tags.request';
import { Validator } from './validator';

const schema = Joi.object({
  sort: Joi.string()
    .valid('order_asc', 'name_asc', 'name_desc', 'order_desc')
    .optional(),
  page: Joi.number().integer().optional().default(1),
  pageSize: Joi.number().integer().optional().default(10),
});

@Injectable()
export class GetTagValidationPipe
  extends Validator<GetTagsRequest>
  implements PipeTransform<GetTagsRequest>
{
  transform(value: GetTagsRequest) {
    return this.validate(schema, value);
  }
}
