import { DataSource } from 'typeorm';
import UserEntity from './user.entity';
import { CommonRepository } from './../../common/common.repository';

export class UserRepository extends CommonRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    // Pasar la entidad y el dataSource al constructor de CommonRepository
    super(UserEntity, dataSource); 
  }

  // Si necesitas métodos adicionales específicos del repositorio de usuarios, agrégalos aquí.
}