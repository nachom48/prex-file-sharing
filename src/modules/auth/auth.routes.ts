import { Router } from 'express';
import AuthController from './auth.controller';
import { AppDataSource } from './../../config/database';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { UserRepository } from './../user/user.repository';

const router = Router();
const authController = new AuthController(new AuthService(new UserService(new UserRepository(AppDataSource))));

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpDTO'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessJwtTokenDTO'
 *       400:
 *         description: Invalid input
 */
router.post('/signup', (req, res, next) => authController.signUp(req, res, next));

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Signin an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInDTO'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessJwtTokenDTO'
 *       401:
 *         description: Unauthorized
 */
router.post('/signin', (req, res, next) => authController.signIn(req, res, next));

export default router;
