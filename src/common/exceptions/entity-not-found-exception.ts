import { CustomError } from './custom-error';

export class EntityNotFoundException extends CustomError {
  constructor(entity: string, id?: string) {
    super(404, id ? `${entity} with ID ${id} not found` : `${entity} not found`);
  }
}