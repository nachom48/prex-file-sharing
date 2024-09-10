import { CustomError } from './custom-error';

export class ForbiddenException extends CustomError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}
