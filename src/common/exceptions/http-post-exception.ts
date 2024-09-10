import { CustomError } from './custom-error';

export class HttpPostException extends CustomError {
  constructor(message = 'Unable to create resource') {
    super(500, message);
  }
}