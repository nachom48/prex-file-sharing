import { Request, Response, NextFunction } from 'express';
import { NotFoundException } from '../common/exceptions/not-found-exception';
import { BadRequestException } from '../common/exceptions/bad-request-exception';
import { FindOptionsWhere } from 'typeorm';
import CommonEntity from '../common/common.entity';
import CommonService from './common.service';

export class CommonController<T extends CommonEntity> {
    constructor(protected readonly service: CommonService<T>) {}

    public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.findOne({ where: { id: req.params.id } as FindOptionsWhere<T> });
            if (!entity) {
                throw new NotFoundException('Entity not found');
            }
            res.json(entity);
        } catch (error) {
            next(error);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newEntity = await this.service.save(req.body);
            res.status(201).json(newEntity);
        } catch (error) {
            if (error instanceof BadRequestException) {
                res.status(400).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const updatedEntity = await this.service.update(req.params.id, req.body);
            if (!updatedEntity) {
                throw new NotFoundException('Entity not found');
            }
            res.json(updatedEntity);
        } catch (error) {
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.findOne({ where: { id: req.params.id } as FindOptionsWhere<T> });
            if (!entity) {
                throw new NotFoundException('Entity not found');
            }
            await this.service.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 0 } = req.query;
            const entities = await this.service.list({ page: +page });
            res.json(entities);
        } catch (error) {
            next(error);
        }
    }
}
