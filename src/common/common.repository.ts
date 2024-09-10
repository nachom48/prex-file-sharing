// src/common/common.repository.ts
import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    In,
    ObjectLiteral,
    Repository,
    SaveOptions,
    UpdateResult,
    DataSource
  } from 'typeorm';
  import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
  import { ICommonRepository } from './interfaces/common.repository.interface';
  
  export class CommonRepository<T extends ObjectLiteral> implements ICommonRepository<T> {
    protected repository: Repository<T>;
  
    constructor(entity: new () => T, dataSource: DataSource) {
      this.repository = dataSource.getRepository(entity);
    }
  
    findOne(options: FindOneOptions<T>): Promise<T | null> {
      return this.repository.findOne(options);
    }
  
    save(entities: DeepPartial<T>[], options?: SaveOptions): Promise<T[]>;
    save(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    save(entityOrEntities: DeepPartial<T> | DeepPartial<T>[], options?: SaveOptions): Promise<T | T[]> {
      if (Array.isArray(entityOrEntities)) {
        return this.repository.save(entityOrEntities, options) as Promise<T[]>;
      } else {
        return this.repository.save(entityOrEntities, options) as Promise<T>;
      }
    }
  
  
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
      return this.repository.findAndCount(options);
    }
  
    softDelete(criteria: string | string[] | FindOptionsWhere<T>): Promise<void> {
      return this.repository.softDelete(criteria).then(() => undefined);
    }
  
    update(id: string, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
      return this.repository.update(id, data);
    }
  
    findByIds(ids: string[]): Promise<T[]> {
      return this.repository.find({ where: { id: In(ids) as any } });
    }
  }
  