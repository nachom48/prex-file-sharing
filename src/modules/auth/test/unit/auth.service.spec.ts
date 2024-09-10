import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthService } from './../../auth.service';
import IAuthUserService from './../../interface/auth-user-service.interface';
import { SignInDTO } from './../../dto/sign-in.dto';
import { UnauthorizedException } from './../../../../common/exceptions/unathorized-exception'
import SignUpDTO from '../../dto/sign-up.dto';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service Unit Testing', () => {
  const mockedUserService: IAuthUserService = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const authService = new AuthService(mockedUserService);

  describe('Testing Sign In Function', () => {
    const signInDto: SignInDTO = { email: 'test@example.com', password: 'password123' };

    test('Login Successfully', async () => {
      const userMock = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

      mockedUserService.findOne = jest.fn().mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

      const result = await authService.signIn(signInDto);

      expect(mockedUserService.findOne).toHaveBeenCalledWith({ where: { email: signInDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(signInDto.password, userMock.password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: userMock.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      expect(result).toEqual({ token: 'fakeToken' });
    });

    test('Throw UnauthorizedException if user is not found', async () => {
      mockedUserService.findOne = jest.fn().mockResolvedValue(null);

      await expect(authService.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });

    test('Throw UnauthorizedException if password is incorrect', async () => {
      const userMock = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

      mockedUserService.findOne = jest.fn().mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Testing Sign Up Function', () => {
    const signUpDto: SignUpDTO = { email: 'newuser@example.com', password: 'newpassword123',userName:'johnDoe' };
    const userMock = { id: 1, email: 'newuser@example.com' };

    test('Create user successfully and return token', async () => {
      mockedUserService.createUser = jest.fn().mockResolvedValue(userMock);
      (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

      const result = await authService.signUp(signUpDto);

      expect(mockedUserService.createUser).toHaveBeenCalledWith(signUpDto);
      expect(jwt.sign).toHaveBeenCalledWith({ id: userMock.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      expect(result).toEqual({ user: userMock, token: 'fakeToken' });
    });

    test('Throw error when user creation fails', async () => {
      mockedUserService.createUser = jest.fn().mockRejectedValue(new Error('Creation failed'));

      await expect(authService.signUp(signUpDto)).rejects.toThrow('Creation failed');
    });
  });
});
