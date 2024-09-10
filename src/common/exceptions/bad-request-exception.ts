import { CustomError } from './custom-error';

export class BadRequestException extends CustomError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}