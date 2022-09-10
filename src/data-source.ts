import { DataSource } from 'typeorm';
import dbConfig from './config/db.config';
export default new DataSource({
  type: 'postgres',
  ...dbConfig(),
  migrationsRun: false,
  entities: [`${__dirname}/entity/**/*{.ts,.js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  synchronize: false,
  cache: false,
});
