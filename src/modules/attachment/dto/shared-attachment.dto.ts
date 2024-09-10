import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     ShareFileDTO:
 *       type: object
 *       properties:
 *         fileId:
 *           type: string
 *           format: uuid
 *           description: The ID of the file to be shared
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         userIds:
 *           type: array
 *           description: List of user IDs to share the file with
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
 */
export class ShareFileDTO {
  @IsUUID(undefined, { message: 'The file ID must be a valid UUID' })
  fileId: string;

  @IsArray({ message: 'User IDs must be an array' })
  @ArrayNotEmpty({ message: 'At least one user ID must be provided' })
  @IsUUID(undefined, { each: true, message: 'Each user ID must be a valid UUID' })
  userIds: string[];
}
