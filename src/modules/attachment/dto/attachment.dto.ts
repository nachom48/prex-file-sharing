import CommonDTO from "../../../common/dto/common.dto";
import UserDTO from "./../../user/dto/user.dto";
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     AttachmentDTO:
 *       type: object
 *       properties:
 *         fileName:
 *           type: string
 *           description: Name of the file
 *           example: document.pdf
 *         fileKey:
 *           type: string
 *           description: Unique key of the file in S3
 *           example: user123/1633098273819_document.pdf
 *         s3Url:
 *           type: string
 *           description: URL of the file in S3
 *           example: https://bucket.s3.amazonaws.com/user123/1633098273819_document.pdf
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID of the owner
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         sharedTo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserDTO'
 *           description: List of users with whom the file is shared
 */
export class AttachmentDTO extends CommonDTO {
    @IsString()
    fileName: string;

    @IsString()
    fileKey: string;

    @IsString()
    s3Url: string;

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsArray()
    sharedTo?: UserDTO[];
}
