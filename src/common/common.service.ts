import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions } from 'typeorm';
import { ICommonService } from './interfaces/common.service.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ICommonRepository } from './interfaces/common.repository.interface';

export const DEFAULT_TAKE = 25;

export default class CommonService<T> implements ICommonService<T> {
    constructor(protected readonly repository: ICommonRepository<T>) { }

    public findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this.repository.findOne(options);
    }

    public save(entities: DeepPartial<T>[], options?: SaveOptions): Promise<T[]>;
    public save(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    public save(entities: any, options?: SaveOptions): any {
        return this.repository.save(entities, options);
    }

    public findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount(options);
    }

    public async list(options: { page: number } & FindManyOptions<T> = { page: 0 }): Promise<{ results: T[]; count: number }> {
        const { page, ...extractedOptions } = options;
        const forcedOptions: FindManyOptions<T> = { ...extractedOptions };

        if (!forcedOptions.take) forcedOptions.take = DEFAULT_TAKE;
        if (!forcedOptions.skip) forcedOptions.skip = page * DEFAULT_TAKE;

        const findResult = await this.findAndCount(forcedOptions);

        return {
            results: findResult[0],
            count: findResult[1]
        };
    }

    public async delete(criteria: string | string[] | FindOptionsWhere<T>): Promise<void> {
        return this.repository.softDelete(criteria);
    }

    public async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T> {
        await this.repository.update(id, data);
        const updatedEntity = await this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
        if (!updatedEntity) {
            throw new Error('Entity not found');
        }
        return updatedEntity;
    }
}
