// src/config/ormconfig.test.ts
import { DataSource } from 'typeorm';
import UserEntity from './../modules/user/user.entity';
import AttachmentEntity from './../modules/attachment/attachment.entity';


export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [UserEntity, AttachmentEntity],
  dropSchema: true,
});