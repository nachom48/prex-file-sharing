import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFileNameDTO:
 *       type: object
 *       properties:
 *         newFileName:
 *           type: string
 *           description: The new name for the file.
 *           example: updated_filename.txt
 */
export class UpdateFileNameDTO {
  @IsNotEmpty({ message: 'File name cannot be empty' })
  @IsString({ message: 'File name must be a string' })
  newFileName: string;
}
