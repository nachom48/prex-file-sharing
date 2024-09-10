import { AttachmentDTO } from "./../../attachment/dto/attachment.dto";
import CommonDTO from "../../../common/dto/common.dto";
import { IsEmail, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: The password of the user (only for registration and authentication purposes)
 *           example: secretPassword123
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentDTO'
 *           description: List of attachments owned by the user
 *         receivedAttachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentDTO'
 *           description: List of attachments shared with the user
 */
export default class UserDTO extends CommonDTO {
    @IsString()
    userName: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    attachments: AttachmentDTO[];

    receivedAttachments: AttachmentDTO[];
}
