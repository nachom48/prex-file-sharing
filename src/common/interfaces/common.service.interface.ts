// src/interfaces/common.service.interface.ts
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions } from 'typeorm';

export interface ICommonService<T> {
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    save(entities: DeepPartial<T>[], options?: SaveOptions): Promise<T[]>;
    save(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    list(options: { page: number } & FindManyOptions<T>): Promise<{ results: T[]; count: number }>;
    delete(criteria: string | string[] | FindOptionsWhere<T>): Promise<void>;
    // Otros métodos comunes
}
