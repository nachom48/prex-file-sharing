import { IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     AccessJwtTokenDTO:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for accessing the API.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export default class AccessJwtTokenDTO {
  @IsString()
  token: string;
}
