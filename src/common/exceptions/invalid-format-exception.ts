import { CustomError } from './custom-error';

export class InvalidIdFormatException extends CustomError {
  constructor(message = 'Invalid ID format') {
    super(400, message); // Código de estado 400 para un error de solicitud incorrecta
  }
}