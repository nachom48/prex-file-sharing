import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICommonRepository<T> {
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    save(entities: DeepPartial<T>[], options?: SaveOptions): Promise<T[]>;
    save(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    softDelete(criteria: string | string[] | FindOptionsWhere<T>): Promise<void>;
    update(id: string, data: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
}
