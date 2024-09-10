import { CustomError } from './custom-error';

export class UnauthorizedException extends CustomError {
  constructor(message = 'Invalid credentials') {
    super(401, message);
  }
}