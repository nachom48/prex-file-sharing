import { CustomError } from './custom-error';

export class NotFoundException extends CustomError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}
