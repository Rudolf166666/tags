import { ObjectSchema } from 'joi';
import { ApiException } from 'src/exception/api.exception';

export class Validator<T> {
  validate(schema: ObjectSchema<T>, value: T) {
    const result = schema.validate(value);
    if (result.error) {
      throw ApiException.badRequest(
        result.error.details.map((d) => d.message).join(),
      );
    }
    return value;
  }
}
