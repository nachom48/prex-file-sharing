import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UnauthorizedException } from '../../common/exceptions/unathorized-exception';
import { UserService } from './../user/user.service';
import { SignInDTO } from './dto/sign-in.dto';
import SignUpDTO from './dto/sign-up.dto';

export class AuthService {
  private userService: UserService;

   constructor(userService: UserService) {
    this.userService = userService;
  }


  public async signUp(signUpDto: SignUpDTO) {
    // Delegar la creación del usuario al UserService
    const user = await this.userService.createUser(signUpDto);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { user, token };
  }

  public async signIn(signInDto: SignInDTO) {
    const user = await this.userService.findOne({ where: { email: signInDto.email } });

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { token };
  }
}