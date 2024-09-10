import { DataSource } from 'typeorm';
import UserEntity from './user.entity';
import { CommonRepository } from './../../common/common.repository';

export class UserRepository extends CommonRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource);
  }

}