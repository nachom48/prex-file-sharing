import { CustomError } from './custom-error';

export class EntityAlreadyExistsException extends CustomError {
  constructor(entityName: string, message: string = `${entityName} already exists`) {
    super(409, message); 
  }
}
