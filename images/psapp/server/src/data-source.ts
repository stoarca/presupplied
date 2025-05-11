import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { CustomNamingStrategy } from './custom-naming-strategy';

import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env['POSTGRES_CONNECTION_HOST'],
  port: 5432,
  username: env['POSTGRES_CONNECTION_USER'],
  password: env['POSTGRES_CONNECTION_PASSWORD'],
  database: env['POSTGRES_CONNECTION_DB'],
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, './entity/**/*.ts')],
  migrations: [path.join(__dirname, './migration/**/*.ts')],
  subscribers: [],
  entitySkipConstructor: true,
  namingStrategy: new CustomNamingStrategy(),
})

