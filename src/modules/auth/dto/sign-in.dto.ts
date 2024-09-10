import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     SignInDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: User's password.
 *           example: "password123"
 */
export class SignInDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(partial: Partial<SignInDTO>) {
    Object.assign(this, partial);
  }
}
