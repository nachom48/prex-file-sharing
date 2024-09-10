import { CustomError } from './custom-error';

export class FileNotFoundException extends CustomError {
  constructor(message = 'File Not Found') {
    super(404, message);
  }
}
