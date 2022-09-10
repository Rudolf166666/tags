import { NestFactory } from '@nestjs/core';
import apiConfig from './config/api.config';
import { HttpExceptionFilter } from './exception/exception.filter';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(apiConfig().port);
}
bootstrap();
