import { DataSource } from 'typeorm';
import AttachmentEntity from './attachment.entity';
import { CommonRepository } from './../../common/common.repository';

export class AttachmentRepository extends CommonRepository<AttachmentEntity> {
  constructor(dataSource: DataSource) {
    super(AttachmentEntity, dataSource); 
  }

}