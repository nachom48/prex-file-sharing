import { Request, Response, NextFunction } from 'express';
import { SignInDTO } from './dto/sign-in.dto';
import { validateOrReject } from 'class-validator';
import SignUpDTO from './dto/sign-up.dto';
import { AuthService } from './auth.service';

export default class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpDto = new SignUpDTO(req.body);
      await validateOrReject(signUpDto);
      const result = await this.authService.signUp(signUpDto);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDto = new SignInDTO(req.body);
      await validateOrReject(signInDto);
      const result = await this.authService.signIn(signInDto);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
