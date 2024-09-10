import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpDTO:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: Name of the user.
 *           example: "JohnDoe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the user.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: Password for the user.
 *           example: "securePassword123"
 */
export default class SignUpDTO {
  @IsNotEmpty({ message: 'User name is required' })
  @IsString({ message: 'User name must be a string' })
  userName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  constructor(partial: Partial<SignUpDTO>) {
    Object.assign(this, partial);
  }
}
