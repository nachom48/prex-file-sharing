import { CustomError } from './custom-error';

export class EntityAlreadySharedException extends CustomError {
  constructor(entityName: string, message: string = `${entityName} is already shared with all specified users`) {
    super(409, message); 
  }
}